import { Inject, Injectable } from '@nestjs/common';
import { AssociateNotFoundException } from '../../../common/exceptions';
import type { StorageServiceInterface } from '../../storage/interfaces/storage.service.interface';
import { EditAssociateDto } from '../dto/edit-associate.dto';
import { Associate } from '../entities/associate.entity';
import { AssociateMap } from '../mappers/associate.map';
import type { AssociateRepositoryInterface } from '../repositories/associate.repository.interface';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);

@Injectable()
export class EditAssociateUseCase {
  constructor(
    @Inject('AssociateRepositoryInterface')
    private readonly associateRepository: AssociateRepositoryInterface,
    @Inject('StorageServiceInterface')
    private readonly storageService: StorageServiceInterface,
  ) {}

  async execute(
    input: EditAssociateDto & { image?: Express.Multer.File },
  ): Promise<void> {
    const existing = await this.associateRepository.findById(input.id);

    if (!existing) {
      throw new AssociateNotFoundException({ associateId: input.id });
    }

    const mappedExisting = AssociateMap.map(existing);

    // Converter birthDate ANTES do assign se vier como string
    let birthDate = input.birthDate;
    if (birthDate && typeof birthDate === 'string') {
      // Tentar formato DD/MM/YYYY (brasileiro)
      let parsedDate = dayjs(birthDate, 'DD/MM/YYYY', true);

      // Se não for válido, tentar outros formatos
      if (!parsedDate.isValid()) {
        parsedDate = dayjs(birthDate);
      }

      // Se ainda não for válido, mantém valor anterior
      birthDate = parsedDate.isValid()
        ? parsedDate.toDate()
        : (mappedExisting.birthDate as any);
    }

    // isSpecialNeeds pode vir como string, converter ANTES do assign
    let isSpecialNeeds = input.isSpecialNeeds;
    if (typeof isSpecialNeeds === 'string') {
      const v = String(isSpecialNeeds).toLowerCase();
      isSpecialNeeds = ['true', '1', 'on', 'yes'].includes(v) as any;
    }

    const assignedAssociates = Object.assign(mappedExisting, {
      ...input,
      birthDate,
      isSpecialNeeds,
    });

    // Se veio arquivo de imagem no multipart, faz upload e atualiza urlImage
    if (input.image) {
      const uploadedUrl = await this.storageService.uploadImage(input.image);
      assignedAssociates.urlImage = uploadedUrl;
    }

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
      existing.deletedAt,
    );

    console.log('Associate to be updated:', associate);

    await this.associateRepository.update(associate);
  }
}
