import { Injectable, Inject } from '@nestjs/common';
import { UnityNotFoundException } from '../../../common/exceptions';
import { UnityRepositoryInterface } from '../repositories/unity.repository.interface';

@Injectable()
export class DeleteUnityUseCase {
  constructor(
    @Inject('UnityRepositoryInterface')
    private readonly unityRepository: UnityRepositoryInterface,
  ) {}

  async execute(id: string): Promise<void> {
    const unity = await this.unityRepository.findById(id);

    if (!unity) {
      throw new UnityNotFoundException({
        unityId: id,
      });
    }

    await this.unityRepository.delete(id);
  }
}
