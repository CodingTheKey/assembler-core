import { Inject, Injectable } from '@nestjs/common';
import { AssociateNotFoundException } from '../../../common/exceptions';
import { EditAssociateDto } from '../dto/edit-associate.dto';
import { Associate } from '../entities/associate.entity';
import { AssociateMap } from '../mappers/associate.map';
import type { AssociateRepositoryInterface } from '../repositories/associate.repository.interface';

@Injectable()
export class EditAssociateUseCase {
  constructor(
    @Inject('AssociateRepositoryInterface')
    private readonly associateRepository: AssociateRepositoryInterface,
  ) {}

  async execute(input: EditAssociateDto): Promise<void> {
    const existing = await this.associateRepository.findById(input.id);

    if (!existing) {
      throw new AssociateNotFoundException({ associateId: input.id });
    }

    const mappedExisting = AssociateMap.map(existing);

    const assignedAssociates = Object.assign(mappedExisting, input);

    const associate = new Associate(
      input.id,
      assignedAssociates.name,
      assignedAssociates.address,
      existing.isActive,
      assignedAssociates.associatedUnityName,
      assignedAssociates.email,
      assignedAssociates.urlImage,
      assignedAssociates.gender,
      assignedAssociates.birthDate,
      assignedAssociates.nationality,
      assignedAssociates.placeOfBirth,
      assignedAssociates.number,
      assignedAssociates.neighborhood,
      assignedAssociates.city,
      assignedAssociates.zipCode,
      assignedAssociates.cellPhone,
      assignedAssociates.rg,
      assignedAssociates.cpf,
      assignedAssociates.isSpecialNeeds,
      assignedAssociates.voterRegistrationNumber,
      assignedAssociates.electoralZone,
      assignedAssociates.electoralSection,
      assignedAssociates.maritalStatus,
      assignedAssociates.unityId,
    );

    await this.associateRepository.update(associate);
  }
}
