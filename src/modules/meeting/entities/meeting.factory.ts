import cuid from 'cuid';
import { Meeting, MeetingStatus } from './meeting.entity';

export class MeetingFactory {
  static create(m: {
    title: string;
    description: string;
    unityName: string;
    startDate: Date;
    location: string;
    status?: MeetingStatus;
  }): Meeting {
    return new Meeting(
      cuid(),
      m.title,
      m.description,
      m.unityName,
      m.startDate,
      m.location,
      m.status || 'scheduled',
    );
  }

  static createWithId(id: string, m: {
    title: string;
    description: string;
    unityName: string;
    startDate: Date;
    location: string;
    status: MeetingStatus;
  }): Meeting {
    return new Meeting(
      id,
      m.title,
      m.description,
      m.unityName,
      m.startDate,
      m.location,
      m.status,
    );
  }
}