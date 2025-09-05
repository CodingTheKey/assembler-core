import { IsString, MinLength, IsOptional } from 'class-validator';

export class CreateUnityDto {
  @IsString()
  @MinLength(3)
  name: string;

  @IsString()
  @MinLength(3)
  address: string;

  @IsOptional()
  logo?: File | null;
}
