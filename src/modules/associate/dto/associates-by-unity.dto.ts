import { IsNotEmpty, IsString } from 'class-validator';

export class AssociatesByUnityDto {
  @IsString()
  @IsNotEmpty()
  unityId!: string;
}

