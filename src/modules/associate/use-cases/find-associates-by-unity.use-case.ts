import { Injectable, Inject } from '@nestjs/common';
import type { AssociateRepositoryInterface } from '../repositories/associate.repository.interface';
import { Associate } from '../entities/associate.entity';

@Injectable()
export class FindAssociatesByUnityUseCase {
  constructor(
    @Inject('AssociateRepositoryInterface')
    private readonly associateRepository: AssociateRepositoryInterface,
  ) {}

  async execute(unityId: string): Promise<Associate[]> {
    return await this.associateRepository.findByUnityId(unityId);
  }
}

