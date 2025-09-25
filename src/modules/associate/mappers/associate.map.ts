type MappedAssociate = {
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
};

export class AssociateMap {
  static map(associate: MappedAssociate) {
    return {
      id: associate.id,
      name: associate.name,
      isActive: associate.isActive,
      address: associate.address,
      email: associate.email,
      urlImage: associate.urlImage,
      gender: associate.gender,
      birthDate: associate.birthDate,
      nationality: associate.nationality,
      placeOfBirth: associate.placeOfBirth,
      number: associate.number,
      neighborhood: associate.neighborhood,
      city: associate.city,
      zipCode: associate.zipCode,
      cellPhone: associate.cellPhone,
      rg: associate.rg,
      cpf: associate.cpf,
      isSpecialNeeds: associate.isSpecialNeeds,
      voterRegistrationNumber: associate.voterRegistrationNumber,
      electoralZone: associate.electoralZone,
      electoralSection: associate.electoralSection,
      maritalStatus: associate.maritalStatus,
      associatedUnityName: associate.associatedUnityName,
      unityId: associate.unityId,
      deletedAt: associate.deletedAt,
    };
  }

  static mapMany(associates: MappedAssociate[]) {
    return associates.map((associate) => this.map(associate));
  }
}
