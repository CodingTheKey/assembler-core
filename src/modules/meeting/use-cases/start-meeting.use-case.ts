import { Inject, Injectable } from '@nestjs/common';
import type { MeetingRepositoryInterface } from '../repositories/meeting.repository.interface';

@Injectable()
export class StartMeetingUseCase {
  constructor(
    @Inject('MeetingRepositoryInterface')
    private readonly meetingRepository: MeetingRepositoryInterface,
  ) {}

  async execute(id: string): Promise<void> {
    const meeting = await this.meetingRepository.findById(id);

    if (!meeting) {
      throw new Error('Meeting not found');
    }

    await this.meetingRepository.startMeeting(id);
  }
}
