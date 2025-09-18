import { Inject, Injectable } from '@nestjs/common';
import { AssociateAlreadyExistsInUnityException } from '../../../common/exceptions';
import { CreateAssociateDto } from '../dto/create-associate.dto';
import { AssociateFactory } from '../entities/associate.factory';
import type { AssociateRepositoryInterface } from '../repositories/associate.repository.interface';

@Injectable()
export class CreateAssociateUseCase {
  constructor(
    @Inject('AssociateRepositoryInterface')
    private readonly associateRepository: AssociateRepositoryInterface,
  ) {}

  async execute(input: CreateAssociateDto): Promise<void> {
    const associate = AssociateFactory.create({
      name: input.name,
      address: input.address,
      isActive: true,
      associatedUnityName: input.associatedUnityName,
      email: input.email,
      urlImage: input.urlImage || null,
      gender: input.gender,
      birthDate: input.birthDate,
      nationality: input.nationality,
      placeOfBirth: input.placeOfBirth,
      number: input.number,
      neighborhood: input.neighborhood,
      city: input.city,
      zipCode: input.zipCode,
      cellPhone: input.cellPhone,
      rg: input.rg,
      cpf: input.cpf,
      isSpecialNeeds: input.isSpecialNeeds,
      voterRegistrationNumber: input.voterRegistrationNumber,
      electoralZone: input.electoralZone,
      electoralSection: input.electoralSection,
      maritalStatus: input.maritalStatus,
      unityId: input.unityId,
    });

    const existingAssociate =
      await this.associateRepository.findAssociateExistingAssociateInUnity(
        input.cpf,
        input.unityId,
      );

    if (existingAssociate) {
      throw new AssociateAlreadyExistsInUnityException({
        cpf: input.cpf,
        cause: existingAssociate,
      });
    }

    await this.associateRepository.create(associate);
  }
}
