import { Inject, Injectable } from '@nestjs/common';
import type { MeetingRepositoryInterface } from '../repositories/meeting.repository.interface';

@Injectable()
export class StartMeetingUseCase {
  constructor(
    @Inject('MeetingRepositoryInterface')
    private readonly meetingRepository: MeetingRepositoryInterface,
  ) {}

  async execute(id: string): Promise<void> {
    await this.meetingRepository.startMeeting(id);
  }
}