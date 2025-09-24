import { Module } from '@nestjs/common';
import { MeetingController } from './controllers/meeting.controller';
import { CreateMeetingUseCase } from './use-cases/create-meeting.use-case';
import { FindMeetingByIdUseCase } from './use-cases/find-meeting-by-id.use-case';
import { ListMeetingsUseCase } from './use-cases/list-meetings.use-case';
import { CountMeetingsUseCase } from './use-cases/count-meetings.use-case';
import { StartMeetingUseCase } from './use-cases/start-meeting.use-case';
import { MeetingPrismaRepository } from './repositories/meeting.prisma.repository';

@Module({
  controllers: [MeetingController],
  providers: [
    CreateMeetingUseCase,
    FindMeetingByIdUseCase,
    ListMeetingsUseCase,
    CountMeetingsUseCase,
    StartMeetingUseCase,
    {
      provide: 'MeetingRepositoryInterface',
      useClass: MeetingPrismaRepository,
    },
  ],
})
export class MeetingModule {}
