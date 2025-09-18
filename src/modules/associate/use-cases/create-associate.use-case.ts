import { Inject, Injectable } from '@nestjs/common';
import { AssociateAlreadyExistsInUnityException } from '../../../common/exceptions';
import { CreateAssociateDto } from '../dto/create-associate.dto';
import { Associate } from '../entities/associate.entity';
import type { AssociateRepositoryInterface } from '../repositories/associate.repository.interface';

@Injectable()
export class CreateAssociateUseCase {
  constructor(
    @Inject('AssociateRepositoryInterface')
    private readonly associateRepository: AssociateRepositoryInterface,
  ) {}

  async execute(input: CreateAssociateDto): Promise<void> {
    const associate = new Associate(
      '',
      input.name,
      input.address,
      true,
      input.associatedUnityName,
      input.email,
      (input.image as string) || null,
      input.gender,
      input.birthDate,
      input.nationality,
      input.placeOfBirth,
      input.number,
      input.neighborhood,
      input.city,
      input.zipCode,
      input.cellPhone,
      input.rg,
      input.cpf,
      input.isSpecialNeeds,
      input.voterRegistrationNumber,
      input.electoralZone,
      input.electoralSection,
      input.maritalStatus,
    );

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
