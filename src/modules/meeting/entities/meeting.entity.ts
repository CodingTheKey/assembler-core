import { BaseEntity } from '../../../common/entities/base.entity';
import { Associate } from '../../associate/entities/associate.entity';

export type MeetingStatus = 'scheduled' | 'canceled' | 'paused' | 'finished';

export class Meeting extends BaseEntity {
  private _participants: Associate[] = [];

  constructor(
    protected readonly _id: string,
    public title: string,
    public description: string,
    public unityName: string,
    public startDate: Date,
    public location: string,
    public status: MeetingStatus,
  ) {
    super(_id);
  }

  addParticipant(associate: Associate): void {
    this._participants.push(associate);
  }

  removeParticipant(associateId: string): void {
    this._participants = this._participants.filter((a) => a.id !== associateId);
  }

  get participantsList(): Associate[] {
    return this._participants;
  }
}
