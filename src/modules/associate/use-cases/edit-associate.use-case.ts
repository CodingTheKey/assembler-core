import { Inject, Injectable } from '@nestjs/common';
import { AssociateNotFoundException } from '../../../common/exceptions';
import { EditAssociateDto } from '../dto/edit-associate.dto';
import { Associate } from '../entities/associate.entity';
import { AssociateMap } from '../mappers/associate.map';
import type { AssociateRepositoryInterface } from '../repositories/associate.repository.interface';
import type { StorageServiceInterface } from '../../storage/interfaces/storage.service.interface';

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
    const assignedAssociates = Object.assign(mappedExisting, input);

    // Se veio arquivo de imagem no multipart, faz upload e atualiza urlImage
    if (input.image) {
      const uploadedUrl = await this.storageService.uploadImage(input.image);
      assignedAssociates.urlImage = uploadedUrl;
    }

    // Garantir tipos corretos quando vierem como string (multipart)
    // birthDate pode vir string, converter para Date.
    if (
      assignedAssociates.birthDate &&
      typeof assignedAssociates.birthDate === 'string'
    ) {
      const d = new Date(assignedAssociates.birthDate);
      // Em caso de data inválida, mantém valor anterior (existing)
      assignedAssociates.birthDate = Number.isNaN(d.getTime())
        ? mappedExisting.birthDate
        : d;
    }

    // isSpecialNeeds pode vir como string
    if (typeof assignedAssociates.isSpecialNeeds === 'string') {
      const v = assignedAssociates.isSpecialNeeds.toLowerCase();
      assignedAssociates.isSpecialNeeds = ['true', '1', 'on', 'yes'].includes(v);
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

    await this.associateRepository.update(associate);
  }
}
