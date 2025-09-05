import { IsString } from 'class-validator';

export class DeleteUnityDto {
  @IsString()
  id: string;
}
