import { IsNotEmpty, IsString } from 'class-validator';

export class AssociatesByUnityDto {
  @IsString()
  @IsNotEmpty()
  unityId!: string;
}

export type OutputAssociatesByUnityDto = {
  id: string;
  name: string;
  isActive: boolean;
  address: string;
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
  associatedUnityName: string;
  unityId: string;
  deletedAt: Date | null;
}[];
