import cuid from 'cuid';
import { Associate } from './associate.entity';

export class AssociateFactory {
  static create(a: {
    name: string;
    address: string;
    isActive: boolean;
    associatedUnityName: string;
    email: string;
    urlImage: string | null;
    gender: string;
    birthDate: Date;
    nationality: string;
    placeOfBirth: string;
    number: string;
    neighborhood: string;
    city: string;
    zipCode: string;
    cellPhone: string;
    rg: string;
    cpf: string;
    isSpecialNeeds: boolean;
    voterRegistrationNumber: string;
    electoralZone: string;
    electoralSection: string;
    maritalStatus: string;
    unityId: string;
  }): Associate {
    return new Associate(
      cuid(),
      a.name,
      a.address,
      a.isActive,
      a.associatedUnityName,
      a.email,
      a.urlImage,
      a.gender,
      a.birthDate,
      a.nationality,
      a.placeOfBirth,
      a.number,
      a.neighborhood,
      a.city,
      a.zipCode,
      a.cellPhone,
      a.rg,
      a.cpf,
      a.isSpecialNeeds,
      a.voterRegistrationNumber,
      a.electoralZone,
      a.electoralSection,
      a.maritalStatus,
      a.unityId,
    );
  }
}
