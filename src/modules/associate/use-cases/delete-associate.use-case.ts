import { Inject, Injectable } from '@nestjs/common';
import { AssociateNotFoundException } from '../../../common/exceptions';
import type { AssociateRepositoryInterface } from '../repositories/associate.repository.interface';

@Injectable()
export class DeleteAssociateUseCase {
  constructor(
    @Inject('AssociateRepositoryInterface')
    private readonly associateRepository: AssociateRepositoryInterface,
  ) {}

  async execute(id: string): Promise<void> {
    const associate = await this.associateRepository.findById(id);

    if (!associate) {
      throw new AssociateNotFoundException({ associateId: id });
    }

    await this.associateRepository.delete(id);
  }
}
