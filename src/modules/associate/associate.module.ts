import { Module } from '@nestjs/common';
import { AssociateController } from './controllers/associate.controller';
import { CreateAssociateUseCase } from './use-cases/create-associate.use-case';
import { FindAssociateByIdUseCase } from './use-cases/find-associate-by-id.use-case';
import { AssociateRepositoryInterface } from './repositories/associate.repository.interface';

@Module({
  controllers: [AssociateController],
  providers: [
    CreateAssociateUseCase,
    FindAssociateByIdUseCase,
    {
      provide: 'AssociateRepositoryInterface',
      useValue: {}, // Replace with actual implementation
    },
  ],
  exports: [AssociateRepositoryInterface],
})
export class AssociateModule {}
