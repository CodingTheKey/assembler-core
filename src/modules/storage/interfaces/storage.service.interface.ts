import type { Express } from 'express';

export interface StorageServiceInterface {
  uploadImage(file: Express.Multer.File): Promise<string>;
}
