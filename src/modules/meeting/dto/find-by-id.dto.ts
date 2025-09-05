import { IsString } from 'class-validator';

export class FindMeetingByIdDto {
  @IsString()
  id: string;
}
