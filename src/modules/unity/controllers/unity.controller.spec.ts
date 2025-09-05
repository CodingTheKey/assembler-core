import { Test, TestingModule } from '@nestjs/testing';
import { UnityController } from './unity.controller';
import { CreateUnityUseCase } from '../use-cases/create-unity.use-case';
import { FindAllUnitiesUseCase } from '../use-cases/find-all-unities.use-case';
import { DeleteUnityUseCase } from '../use-cases/delete-unity.use-case';

describe('UnityController', () => {
  let controller: UnityController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UnityController],
      providers: [
        {
          provide: CreateUnityUseCase,
          useValue: {
            execute: jest.fn(),
          },
        },
        {
          provide: FindAllUnitiesUseCase,
          useValue: {
            execute: jest.fn(),
          },
        },
        {
          provide: DeleteUnityUseCase,
          useValue: {
            execute: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<UnityController>(UnityController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
