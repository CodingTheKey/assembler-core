import { Inject, Injectable } from '@nestjs/common';
import { CreateMeetingDto } from '../dto/create-meeting.dto';
import { Meeting } from '../entities/meeting.entity';
import { MeetingFactory } from '../entities/meeting.factory';
import type { MeetingRepositoryInterface } from '../repositories/meeting.repository.interface';

@Injectable()
export class CreateMeetingUseCase {
  constructor(
    @Inject('MeetingRepositoryInterface')
    private readonly meetingRepository: MeetingRepositoryInterface,
  ) {}

  async execute(input: CreateMeetingDto): Promise<Meeting> {
    const meeting = MeetingFactory.create({
      title: input.title,
      description: input.description,
      startDate: input.startDate,
      location: input.location,
      unityId: input.unityId,
    });

    return await this.meetingRepository.create(meeting);
  }
}
