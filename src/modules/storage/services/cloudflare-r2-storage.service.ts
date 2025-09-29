import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { createHash, createHmac, randomUUID } from 'crypto';
import { extname } from 'path';
import { StorageServiceInterface } from '../interfaces/storage.service.interface';

@Injectable()
export class CloudflareR2StorageService implements StorageServiceInterface {
  private readonly baseUrl: string | null;
  private readonly bucket: string | null;
  private readonly accessKeyId: string | null;
  private readonly secretAccessKey: string | null;
  private readonly region: string;
  private readonly publicBaseUrl?: string;

  constructor() {
    this.baseUrl = process.env.CLOUDFLARE_R2_BASE_URL ?? null;
    this.bucket = process.env.CLOUDFLARE_R2_BUCKET ?? null;
    this.accessKeyId = process.env.CLOUDFLARE_R2_ACCESS_KEY_ID ?? null;
    this.secretAccessKey = process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY ?? null;
    this.region = process.env.CLOUDFLARE_R2_REGION ?? 'auto';
    this.publicBaseUrl = process.env.CLOUDFLARE_R2_PUBLIC_BASE_URL;
  }

  async uploadImage(file: Express.Multer.File): Promise<string> {
    if (
      !this.baseUrl ||
      !this.bucket ||
      !this.accessKeyId ||
      !this.secretAccessKey
    ) {
      throw new InternalServerErrorException(
        'Cloudflare R2 credentials are not configured.',
      );
    }

    if (!file || !file.buffer) {
      throw new InternalServerErrorException('No file provided for upload.');
    }

    const key = this.buildObjectKey(file);
    const uploadUrl = this.buildUploadUrl(key);
    const url = new URL(uploadUrl);

    // Calculate SHA256 hash for x-amz-content-sha256 header
    const contentSha256 = createHash('sha256')
      .update(file.buffer)
      .digest('hex');

    // Generate ISO 8601 date for x-amz-date header
    const now = new Date();
    const amzDate = now.toISOString().replace(/[:\-]|\.\d{3}/g, '');
    const dateStamp = amzDate.substring(0, 8);

    // Create AWS Signature Version 4
    const authorizationHeader = this.createAwsSignature({
      method: 'PUT',
      url,
      headers: {
        'Content-Type': file.mimetype,
        'Content-Length': String(file.size ?? file.buffer.length),
        'x-amz-content-sha256': contentSha256,
        'x-amz-date': amzDate,
        Host: url.host,
      },
      contentSha256,
      amzDate,
      dateStamp,
    });

    try {
      const response = await fetch(uploadUrl, {
        method: 'PUT',
        headers: {
          Authorization: authorizationHeader,
          'Content-Type': file.mimetype,
          'Content-Length': String(file.size ?? file.buffer.length),
          'x-amz-content-sha256': contentSha256,
          'x-amz-date': amzDate,
          Host: url.host,
        },
        body: file.buffer as unknown as BodyInit,
      });

      if (!response.ok) {
        const bodyText = await this.safeReadText(response);
        throw new InternalServerErrorException(
          `Cloudflare R2 REST API responded with ${response.status}: ${bodyText}`,
        );
      }
    } catch (error) {
      console.error('Cloudflare R2 upload error:', error);
      throw new InternalServerErrorException(
        `Failed to reach Cloudflare R2 REST API: ${String(error)}`,
      );
    }

    if (this.publicBaseUrl) {
      return `${this.publicBaseUrl.replace(/\/$/, '')}/${key}`;
    }

    return `${this.baseUrl.replace(/\/$/, '')}/${this.bucket}/${key}`;
  }

  private buildObjectKey(file: Express.Multer.File): string {
    const extension = extname(file.originalname) || '';
    const sanitizedExtension = extension.toLowerCase();
    const id = randomUUID();

    return `associates/${id}${sanitizedExtension}`;
  }

  private buildUploadUrl(key: string): string {
    return `${this.baseUrl?.replace(/\/$/, '')}/${this.bucket}/${key}`;
  }

  private createAwsSignature(params: {
    method: string;
    url: URL;
    headers: Record<string, string>;
    contentSha256: string;
    amzDate: string;
    dateStamp: string;
  }): string {
    const { method, url, headers, contentSha256, amzDate, dateStamp } = params;

    // Step 1: Create canonical request
    const canonicalUri = url.pathname;
    const canonicalQuerystring = url.search.substring(1);

    // Sort headers by name (case-insensitive)
    const sortedHeaders = Object.keys(headers)
      .sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()))
      .map((key) => `${key.toLowerCase()}:${headers[key].trim()}`)
      .join('\n');

    const signedHeaders = Object.keys(headers)
      .sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()))
      .map((key) => key.toLowerCase())
      .join(';');

    const canonicalRequest = [
      method,
      canonicalUri,
      canonicalQuerystring,
      sortedHeaders,
      '',
      signedHeaders,
      contentSha256,
    ].join('\n');

    // Step 2: Create string to sign
    const algorithm = 'AWS4-HMAC-SHA256';
    const credentialScope = `${dateStamp}/${this.region}/s3/aws4_request`;
    const canonicalRequestHash = createHash('sha256')
      .update(canonicalRequest)
      .digest('hex');

    const stringToSign = [
      algorithm,
      amzDate,
      credentialScope,
      canonicalRequestHash,
    ].join('\n');

    // Step 3: Calculate signature
    const kDate = createHmac('sha256', `AWS4${this.secretAccessKey}`)
      .update(dateStamp)
      .digest();
    const kRegion = createHmac('sha256', kDate).update(this.region).digest();
    const kService = createHmac('sha256', kRegion).update('s3').digest();
    const kSigning = createHmac('sha256', kService)
      .update('aws4_request')
      .digest();

    const signature = createHmac('sha256', kSigning)
      .update(stringToSign)
      .digest('hex');

    // Step 4: Create authorization header
    return `${algorithm} Credential=${this.accessKeyId}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`;
  }

  private async safeReadText(response: {
    text: () => Promise<string>;
  }): Promise<string> {
    try {
      return await response.text();
    } catch {
      return '<unavailable body>';
    }
  }
}
