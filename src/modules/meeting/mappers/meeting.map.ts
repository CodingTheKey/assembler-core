import { AssociateMap } from 'src/modules/associate/mappers/associate.map';
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
  participants: Array<{
    id: string;
    name: string;
    isActive: boolean;
    address: string;
    email: string;
    urlImage: string | null;
    gender: string | null;
    birthDate: Date | null;
    nationality: string | null;
    placeOfBirth: string | null;
    number: string | null;
    neighborhood: string | null;
    city: string | null;
    zipCode: string | null;
    cellPhone: string | null;
    rg: string | null;
    cpf: string;
    isSpecialNeeds: boolean;
    voterRegistrationNumber: string | null;
    electoralZone: string | null;
    electoralSection: string | null;
    maritalStatus: string | null;
    associatedUnityName: string;
    unityId: string;
    checkInAt: Date | null;
  }>;
};

export class MeetingMap {
  static map(meeting: Meeting): MappedMeeting {
    return {
      id: meeting.id,
      title: meeting.title,
      description: meeting.description,
      unityName: meeting.unityName || '',
      startDate: meeting.startDate,
      location: meeting.location || '',
      status: meeting.status,
      participants: meeting.participantsSnapshots.map(({ associate, checkInAt }) => ({
        ...AssociateMap.map(associate),
        checkInAt,
      })),
    };
  }

  static mapMany(meetings: Meeting[]): MappedMeeting[] {
    return meetings.map((meeting) => this.map(meeting));
  }
}
