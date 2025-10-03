import { BaseEntity } from '../../../common/entities/base.entity';
import { Associate } from '../../associate/entities/associate.entity';

export type MeetingStatus = 'scheduled' | 'canceled' | 'paused' | 'finished';

type MeetingParticipantSnapshot = {
  associate: Associate;
  checkInAt: Date | null;
};

export class Meeting extends BaseEntity {
  private _participants: MeetingParticipantSnapshot[] = [];

  constructor(
    protected readonly _id: string,
    public title: string,
    public description: string,
    public unityName: string | null,
    public startDate: Date,
    public location: string,
    public status: MeetingStatus,
    public unityId?: string,
  ) {
    super(_id);
  }

  addParticipant(associate: Associate, checkInAt: Date | null = null): void {
    this._participants.push({ associate, checkInAt });
  }

  removeParticipant(associateId: string): void {
    this._participants = this._participants.filter(
      (participant) => participant.associate.id !== associateId,
    );
  }

  get participantsList(): Associate[] {
    return this._participants.map((participant) => participant.associate);
  }

  get participantsSnapshots(): MeetingParticipantSnapshot[] {
    return this._participants;
  }

  getParticipantSnapshot(associateId: string): MeetingParticipantSnapshot | undefined {
    return this._participants.find(
      (participant) => participant.associate.id === associateId,
    );
  }

  getParticipantSnapshotByCpf(
    cpf: string,
  ): MeetingParticipantSnapshot | undefined {
    return this._participants.find((participant) => participant.associate.cpf === cpf);
  }

  start(): void {
    if (this.status !== 'scheduled') {
      throw new Error('Only scheduled meetings can be started');
    }
    this.status = 'finished';
  }

  cancel(): void {
    if (this.status === 'finished') {
      throw new Error('Cannot cancel a finished meeting');
    }
    this.status = 'canceled';
  }

  pause(): void {
    if (this.status !== 'scheduled') {
      throw new Error('Only scheduled meetings can be paused');
    }
    this.status = 'paused';
  }

  isActive(): boolean {
    return this.status === 'scheduled' || this.status === 'paused';
  }
}
