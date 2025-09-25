import { Module } from '@nestjs/common';
import { AssociateController } from './controllers/associate.controller';
import { CreateAssociateUseCase } from './use-cases/create-associate.use-case';
import { FindAssociateByIdUseCase } from './use-cases/find-associate-by-id.use-case';
import { FindAssociatesByUnityUseCase } from './use-cases/find-associates-by-unity.use-case';
import { EditAssociateUseCase } from './use-cases/edit-associate.use-case';
import { DeactivateAssociateUseCase } from './use-cases/deactivate-associate.use-case';
import { DeleteAssociateUseCase } from './use-cases/delete-associate.use-case';
import { AssociatePrismaRepository } from './repositories/associate.prisma.repository';

@Module({
  controllers: [AssociateController],
  providers: [
    CreateAssociateUseCase,
    FindAssociateByIdUseCase,
    FindAssociatesByUnityUseCase,
    EditAssociateUseCase,
    DeactivateAssociateUseCase,
    DeleteAssociateUseCase,
    {
      provide: 'AssociateRepositoryInterface',
      useClass: AssociatePrismaRepository,
    },
  ],
})
export class AssociateModule {}
