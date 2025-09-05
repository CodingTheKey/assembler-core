import { Test, TestingModule } from '@nestjs/testing';
import { AssociateController } from './associate.controller';
import { CreateAssociateUseCase } from '../use-cases/create-associate.use-case';
import { FindAssociateByIdUseCase } from '../use-cases/find-associate-by-id.use-case';

describe('AssociateController', () => {
  let controller: AssociateController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AssociateController],
      providers: [
        {
          provide: CreateAssociateUseCase,
          useValue: {
            execute: jest.fn(),
          },
        },
        {
          provide: FindAssociateByIdUseCase,
          useValue: {
            execute: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AssociateController>(AssociateController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
