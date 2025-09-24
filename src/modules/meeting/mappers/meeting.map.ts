import { Meeting, MeetingStatus } from '../entities/meeting.entity';

type MappedMeeting = {
  id: string;
  title: string;
  description: string;
  unityName: string;
  startDate: Date;
  location: string;
  status: MeetingStatus;
  createdAt?: Date;
  updatedAt?: Date;
};

export class MeetingMap {
  static map(meeting: Meeting): MappedMeeting {
    return {
      id: meeting.id,
      title: meeting.title,
      description: meeting.description,
      unityName: meeting.unityName,
      startDate: meeting.startDate,
      location: meeting.location,
      status: meeting.status,
    };
  }

  static mapMany(meetings: Meeting[]): MappedMeeting[] {
    return meetings.map((meeting) => this.map(meeting));
  }
}