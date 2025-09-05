import { Injectable, Inject } from '@nestjs/common';
import { Meeting } from '../entities/meeting.entity';
import { MeetingRepositoryInterface } from '../repositories/meeting.repository.interface';

@Injectable()
export class FindMeetingByIdUseCase {
  constructor(
    @Inject('MeetingRepositoryInterface')
    private readonly meetingRepository: MeetingRepositoryInterface,
  ) {}

  async execute(id: string): Promise<Meeting | null> {
    return await this.meetingRepository.findById(id);
  }
}
