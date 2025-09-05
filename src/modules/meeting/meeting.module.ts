import { Module } from '@nestjs/common';
import { MeetingController } from './controllers/meeting.controller';
import { CreateMeetingUseCase } from './use-cases/create-meeting.use-case';
import { FindMeetingByIdUseCase } from './use-cases/find-meeting-by-id.use-case';
import { MeetingRepositoryInterface } from './repositories/meeting.repository.interface';

@Module({
  controllers: [MeetingController],
  providers: [
    CreateMeetingUseCase,
    FindMeetingByIdUseCase,
    {
      provide: 'MeetingRepositoryInterface',
      useValue: {}, // Replace with actual implementation
    },
  ],
  exports: [MeetingRepositoryInterface],
})
export class MeetingModule {}
