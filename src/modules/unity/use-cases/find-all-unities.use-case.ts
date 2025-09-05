import { Injectable, Inject } from '@nestjs/common';
import { Unity } from '../entities/unity.entity';
import { UnityRepositoryInterface } from '../repositories/unity.repository.interface';

@Injectable()
export class FindAllUnitiesUseCase {
  constructor(
    @Inject('UnityRepositoryInterface')
    private readonly unityRepository: UnityRepositoryInterface,
  ) {}

  async execute(): Promise<Unity[]> {
    return await this.unityRepository.findAll();
  }
}
