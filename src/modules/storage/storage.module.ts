import { Module } from '@nestjs/common';
import { CloudflareR2StorageService } from './services/cloudflare-r2-storage.service';

@Module({
  providers: [
    {
      provide: 'StorageServiceInterface',
      useClass: CloudflareR2StorageService,
    },
  ],
  exports: ['StorageServiceInterface'],
})
export class StorageModule {}
