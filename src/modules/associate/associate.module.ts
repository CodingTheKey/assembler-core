import { Module } from '@nestjs/common';
import { StorageModule } from '../storage/storage.module';
import { AssociateController } from './controllers/associate.controller';
import { AssociatePrismaRepository } from './repositories/associate.prisma.repository';
import { CreateAssociateUseCase } from './use-cases/create-associate.use-case';
import { DeactivateAssociateUseCase } from './use-cases/deactivate-associate.use-case';
import { DeleteAssociateUseCase } from './use-cases/delete-associate.use-case';
import { EditAssociateUseCase } from './use-cases/edit-associate.use-case';
import { FindAssociateByIdUseCase } from './use-cases/find-associate-by-id.use-case';
import { FindAssociatesByUnityUseCase } from './use-cases/find-associates-by-unity.use-case';
import { GenerateAssociatePdfUseCase } from './use-cases/generate-associate-pdf.use-case';

@Module({
  imports: [StorageModule],
  controllers: [AssociateController],
  providers: [
    CreateAssociateUseCase,
    FindAssociateByIdUseCase,
    FindAssociatesByUnityUseCase,
    EditAssociateUseCase,
    DeactivateAssociateUseCase,
    DeleteAssociateUseCase,
    GenerateAssociatePdfUseCase,
    {
      provide: 'AssociateRepositoryInterface',
      useClass: AssociatePrismaRepository,
    },
  ],
})
export class AssociateModule {}
