import { Inject, Injectable } from '@nestjs/common';
import { OutputAssociatesByUnityDto } from '../dto/associates-by-unity.dto';
import { AssociateMap } from '../mappers/associate.map';
import type { AssociateRepositoryInterface } from '../repositories/associate.repository.interface';

@Injectable()
export class FindAssociatesByUnityUseCase {
  constructor(
    @Inject('AssociateRepositoryInterface')
    private readonly associateRepository: AssociateRepositoryInterface,
  ) {}

  async execute(unityId: string): Promise<OutputAssociatesByUnityDto> {
    const associate = await this.associateRepository.findByUnityId(unityId);

    return AssociateMap.mapMany(associate);
  }
}
