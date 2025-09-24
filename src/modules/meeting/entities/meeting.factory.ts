import cuid from 'cuid';
import { Meeting, MeetingStatus } from './meeting.entity';

export class MeetingFactory {
  static create(m: {
    title: string;
    description: string;
    startDate: Date;
    location: string;
    status?: MeetingStatus;
    unityId: string;
  }): Meeting {
    return new Meeting(
      cuid(),
      m.title,
      m.description,
      null,
      new Date(m.startDate),
      m.location,
      m.status || 'scheduled',
      m.unityId,
    );
  }

  static instantiate(
    id: string,
    m: {
      title: string;
      description: string;
      unityName: string;
      startDate: Date;
      location: string;
      status: MeetingStatus;
      unityId?: string;
    },
  ): Meeting {
    return new Meeting(
      id,
      m.title,
      m.description,
      m.unityName,
      m.startDate,
      m.location,
      m.status,
      m.unityId,
    );
  }
}
