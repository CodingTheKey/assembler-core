import { IsNotEmpty, IsString } from 'class-validator';

export class DeleteAssociateDto {
  @IsString()
  @IsNotEmpty()
  id!: string;
}

