import { Module } from '@nestjs/common';
import { UnityController } from './controllers/unity.controller';
import { CreateUnityUseCase } from './use-cases/create-unity.use-case';
import { FindAllUnitiesUseCase } from './use-cases/find-all-unities.use-case';
import { DeleteUnityUseCase } from './use-cases/delete-unity.use-case';
import { UnityPrismaRepository } from './repositories/unity.prisma.repository';

@Module({
  controllers: [UnityController],
  providers: [
    CreateUnityUseCase,
    FindAllUnitiesUseCase,
    DeleteUnityUseCase,
    {
      provide: 'UnityRepositoryInterface',
      useClass: UnityPrismaRepository,
    },
  ],
})
export class UnityModule {}
