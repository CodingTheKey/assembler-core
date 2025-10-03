import { IsString } from 'class-validator';

export class CheckInMeetingParticipantParamsDto {
  @IsString()
  meetingId: string;

  @IsString()
  cpf: string;
}
