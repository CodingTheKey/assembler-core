import { Module } from '@nestjs/common';
import { AssociateController } from './controllers/associate.controller';
import { CreateAssociateUseCase } from './use-cases/create-associate.use-case';
import { FindAssociateByIdUseCase } from './use-cases/find-associate-by-id.use-case';
import { AssociatePrismaRepository } from './repositories/associate.prisma.repository';

@Module({
  controllers: [AssociateController],
  providers: [
    CreateAssociateUseCase,
    FindAssociateByIdUseCase,
    {
      provide: 'AssociateRepositoryInterface',
      useClass: AssociatePrismaRepository,
    },
  ],
})
export class AssociateModule {}
