import { Inject, Injectable } from '@nestjs/common';
import { MeetingNotFoundException } from 'src/common/exceptions/meeting-not-found.exceptino';
import type { MeetingRepositoryInterface } from '../repositories/meeting.repository.interface';

@Injectable()
export class StartMeetingUseCase {
  constructor(
    @Inject('MeetingRepositoryInterface')
    private readonly meetingRepository: MeetingRepositoryInterface,
  ) {}

  async execute(id: string): Promise<{ success: boolean }> {
    const meeting = await this.meetingRepository.findById(id);

    if (!meeting) {
      throw new MeetingNotFoundException({
        id,
      });
    }

    meeting?.start();

    await this.meetingRepository.startMeeting(meeting);

    return {
      success: true,
    };
  }
}
