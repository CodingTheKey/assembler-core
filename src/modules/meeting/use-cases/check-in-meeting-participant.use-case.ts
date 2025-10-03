import { Inject, Injectable } from '@nestjs/common';
import { MeetingNotFoundException } from 'src/common/exceptions/meeting-not-found.exceptino';
import { MeetingParticipantNotFoundException } from 'src/common/exceptions/meeting-participant-not-found.exception';
import type { MeetingRepositoryInterface } from '../repositories/meeting.repository.interface';

@Injectable()
export class CheckInMeetingParticipantUseCase {
  constructor(
    @Inject('MeetingRepositoryInterface')
    private readonly meetingRepository: MeetingRepositoryInterface,
  ) {}

  async execute(meetingId: string, associateCpf: string): Promise<void> {
    const meeting = await this.meetingRepository.findById(meetingId);

    if (!meeting) {
      throw new MeetingNotFoundException({
        id: meetingId,
      });
    }

    const participant = meeting.getParticipantSnapshotByCpf(associateCpf);

    if (!participant) {
      throw new MeetingParticipantNotFoundException({
        meetingId,
        associateCpf,
      });
    }

    if (participant.checkInAt) {
      return;
    }

    await this.meetingRepository.checkInParticipant(
      meetingId,
      participant.associate.id,
    );
  }
}
