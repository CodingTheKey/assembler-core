import { Inject, Injectable } from '@nestjs/common';
import type { MeetingRepositoryInterface } from '../repositories/meeting.repository.interface';

@Injectable()
export class CountMeetingsUseCase {
  constructor(
    @Inject('MeetingRepositoryInterface')
    private readonly meetingRepository: MeetingRepositoryInterface,
  ) {}

  async execute(): Promise<number> {
    return await this.meetingRepository.countMeetings();
  }
}