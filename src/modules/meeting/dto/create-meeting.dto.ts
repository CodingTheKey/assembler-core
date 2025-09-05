import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsString,
  MinLength,
} from 'class-validator';
import { MeetingStatus } from '../entities/meeting.entity';

export class CreateMeetingDto {
  @IsString()
  @MinLength(3)
  @IsNotEmpty()
  title: string;

  @IsString()
  @MinLength(8)
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  unityId: string;

  @IsDate()
  @IsNotEmpty()
  startDate: Date;

  @IsString()
  @IsNotEmpty()
  location: string;

  @IsString()
  @IsEnum(['scheduled', 'canceled', 'paused', 'finished'])
  @IsNotEmpty()
  status: MeetingStatus;
}
