import { IsString } from 'class-validator';

export class StartMeetingDto {
  @IsString()
  id: string;
}