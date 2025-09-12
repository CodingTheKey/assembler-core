import { Injectable, Inject } from '@nestjs/common';
import { AssociateNotFoundException } from '../../../common/exceptions';
import { Associate } from '../entities/associate.entity';
import type { AssociateRepositoryInterface } from '../repositories/associate.repository.interface';

@Injectable()
export class FindAssociateByIdUseCase {
  constructor(
    @Inject('AssociateRepositoryInterface')
    private readonly associateRepository: AssociateRepositoryInterface,
  ) {}

  async execute(id: string): Promise<Associate> {
    const associate = await this.associateRepository.findById(id);

    if (!associate) {
      throw new AssociateNotFoundException({
        associateId: id,
      });
    }

    return associate;
  }
}
