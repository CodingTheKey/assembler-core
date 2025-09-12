import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { AssociateModule } from './modules/associate/associate.module';
import { UnityModule } from './modules/unity/unity.module';
import { MeetingModule } from './modules/meeting/meeting.module';
import { BaseExceptionFilter } from './common/filters/base-exception.filter';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';

@Module({
  imports: [DatabaseModule, AssociateModule, UnityModule, MeetingModule],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: BaseExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
  ],
})
export class AppModule {}
