import { Module } from '@nestjs/common';
import { UnityController } from './controllers/unity.controller';
import { CreateUnityUseCase } from './use-cases/create-unity.use-case';
import { FindAllUnitiesUseCase } from './use-cases/find-all-unities.use-case';
import { DeleteUnityUseCase } from './use-cases/delete-unity.use-case';
import { UnityRepositoryInterface } from './repositories/unity.repository.interface';

@Module({
  controllers: [UnityController],
  providers: [
    CreateUnityUseCase,
    FindAllUnitiesUseCase,
    DeleteUnityUseCase,
    {
      provide: 'UnityRepositoryInterface',
      useValue: {}, // Replace with actual implementation
    },
  ],
  exports: [UnityRepositoryInterface],
})
export class UnityModule {}
