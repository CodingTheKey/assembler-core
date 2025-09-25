import { IsString } from 'class-validator';

export class AssociateByIdDto {
  @IsString()
  id: string;
}

export class OutputAssociateByIdDto {
  id: string;
  name: string;
  address: string;
  isActive: boolean;
  associatedUnityName: string;
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
  unityId: string;
  deletedAt: Date | null;
}
