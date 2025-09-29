import { Inject, Injectable } from '@nestjs/common';
import {
  AssociateAlreadyExistsInUnityException,
  InvalidAssociateBirthDateException,
} from '../../../common/exceptions';
import type { StorageServiceInterface } from '../../storage/interfaces/storage.service.interface';
import { CreateAssociateDto } from '../dto/create-associate.dto';
import { AssociateFactory } from '../entities/associate.factory';
import type { AssociateRepositoryInterface } from '../repositories/associate.repository.interface';

type CreateAssociateInput = Omit<
  CreateAssociateDto,
  'birthDate' | 'isSpecialNeeds'
> & {
  birthDate: Date | string;
  isSpecialNeeds: boolean | string;
  image?: Express.Multer.File;
};

@Injectable()
export class CreateAssociateUseCase {
  constructor(
    @Inject('AssociateRepositoryInterface')
    private readonly associateRepository: AssociateRepositoryInterface,
    @Inject('StorageServiceInterface')
    private readonly storageService: StorageServiceInterface,
  ) {}

  async execute(input: CreateAssociateInput): Promise<void> {
    const imageUrl = input.image
      ? await this.storageService.uploadImage(input.image)
      : input.urlImage || null;

    const birthDate =
      input.birthDate instanceof Date
        ? input.birthDate
        : new Date(input.birthDate);

    if (Number.isNaN(birthDate.getTime())) {
      throw new InvalidAssociateBirthDateException(String(input.birthDate));
    }

    const isSpecialNeeds =
      typeof input.isSpecialNeeds === 'string'
        ? ['true', '1', 'on', 'yes'].includes(
            input.isSpecialNeeds.toLowerCase(),
          )
        : Boolean(input.isSpecialNeeds);

    const associate = AssociateFactory.create({
      name: input.name,
      address: input.address,
      associatedUnityName: input.associatedUnityName,
      email: input.email,
      urlImage: imageUrl,
      gender: input.gender,
      birthDate,
      nationality: input.nationality,
      placeOfBirth: input.placeOfBirth,
      number: input.number,
      neighborhood: input.neighborhood,
      city: input.city,
      zipCode: input.zipCode,
      cellPhone: input.cellPhone,
      rg: input.rg,
      cpf: input.cpf,
      isSpecialNeeds,
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
