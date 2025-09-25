import { BaseEntity } from '../../../common/entities/base.entity';

export class Associate extends BaseEntity {
  constructor(
    protected _id: string,
    public name: string,
    public address: string,
    public isActive: boolean,
    public associatedUnityName: string,
    public email: string,
    public urlImage: string | null = null,
    public gender: string,
    public birthDate: Date,
    public nationality: string,
    public placeOfBirth: string,
    public number: string,
    public neighborhood: string,
    public city: string,
    public zipCode: string,
    public cellPhone: string,
    public rg: string,
    public cpf: string,
    public isSpecialNeeds: boolean,
    public voterRegistrationNumber: string,
    public electoralZone: string,
    public electoralSection: string,
    public maritalStatus: string,
    public unityId: string,
    public deletedAt: Date | null = null,
  ) {
    super(_id);
  }

  deactivate(): void {
    this.isActive = false;
    this.deletedAt = new Date();
  }
}
