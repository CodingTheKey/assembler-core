import { Meeting } from '../entities/meeting.entity';

export interface MeetingRepositoryInterface {
  findAll(): Promise<Meeting[]>;
  findById(id: string): Promise<Meeting | null>;
  create(meeting: Meeting): Promise<Meeting>;
  update(meeting: Meeting): Promise<Meeting>;
  delete(id: string): Promise<void>;
  countMeetings(): Promise<number>;
  startMeeting(meeting: Meeting): Promise<void>;
}
