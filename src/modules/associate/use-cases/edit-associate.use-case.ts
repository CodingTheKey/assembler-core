import { Injectable, Inject } from '@nestjs/common';
import { AssociateNotFoundException } from '../../../common/exceptions';
import type { AssociateRepositoryInterface } from '../repositories/associate.repository.interface';
import { EditAssociateDto } from '../dto/edit-associate.dto';

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

    await this.associateRepository.update(input.id, {
      name: input.name,
      address: input.address,
      email: input.email,
      urlImage: (input.image as string) || existing.urlImage,
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
      associatedUnityName: input.associatedUnityName,
    } as any);
  }
}

