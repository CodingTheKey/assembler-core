import { Inject, Injectable } from '@nestjs/common';
import { Meeting } from '../entities/meeting.entity';
import type { MeetingRepositoryInterface } from '../repositories/meeting.repository.interface';

@Injectable()
export class ListMeetingsUseCase {
  constructor(
    @Inject('MeetingRepositoryInterface')
    private readonly meetingRepository: MeetingRepositoryInterface,
  ) {}

  async execute(): Promise<Meeting[]> {
    return await this.meetingRepository.findAll();
  }
}