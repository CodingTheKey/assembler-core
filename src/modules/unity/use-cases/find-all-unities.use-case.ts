import { Inject, Injectable } from '@nestjs/common';
import { OutputFindAllUnitiesDto } from '../dto/find-all-unities.dto';
import { UnityMapper } from '../mappers/unity.mapper';
import type { UnityRepositoryInterface } from '../repositories/unity.repository.interface';

@Injectable()
export class FindAllUnitiesUseCase {
  constructor(
    @Inject('UnityRepositoryInterface')
    private readonly unityRepository: UnityRepositoryInterface,
  ) {}

  async execute(): Promise<OutputFindAllUnitiesDto> {
    const unities = await this.unityRepository.findAll();
    return UnityMapper.mapMany(unities);
  }
}
