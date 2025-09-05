import { IsString } from 'class-validator';

export class AssociateByIdDto {
  @IsString()
  id: string;
}
