import { Inject, Injectable } from '@nestjs/common';
import { AssociateNotFoundException } from '../../../common/exceptions';
import { OutputAssociateByIdDto } from '../dto/associate-by-id.dto';
import { AssociateMap } from '../mappers/associate.map';
import type { AssociateRepositoryInterface } from '../repositories/associate.repository.interface';

@Injectable()
export class FindAssociateByIdUseCase {
  constructor(
    @Inject('AssociateRepositoryInterface')
    private readonly associateRepository: AssociateRepositoryInterface,
  ) {}

  async execute(id: string): Promise<OutputAssociateByIdDto> {
    const associate = await this.associateRepository.findById(id);

    if (!associate) {
      throw new AssociateNotFoundException({
        associateId: id,
      });
    }

    return AssociateMap.map(associate);
  }
}
