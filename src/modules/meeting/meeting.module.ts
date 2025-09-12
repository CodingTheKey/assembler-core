import { Module } from '@nestjs/common';
import { MeetingController } from './controllers/meeting.controller';
import { CreateMeetingUseCase } from './use-cases/create-meeting.use-case';
import { FindMeetingByIdUseCase } from './use-cases/find-meeting-by-id.use-case';
import { MeetingPrismaRepository } from './repositories/meeting.prisma.repository';

@Module({
  controllers: [MeetingController],
  providers: [
    CreateMeetingUseCase,
    FindMeetingByIdUseCase,
    {
      provide: 'MeetingRepositoryInterface',
      useClass: MeetingPrismaRepository,
    },
  ],
})
export class MeetingModule {}
