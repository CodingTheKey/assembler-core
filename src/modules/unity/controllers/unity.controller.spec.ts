import { Test, TestingModule } from '@nestjs/testing';
import { UnityController } from './unity.controller';
import { CreateUnityUseCase } from '../use-cases/create-unity.use-case';
import { FindAllUnitiesUseCase } from '../use-cases/find-all-unities.use-case';
import { DeleteUnityUseCase } from '../use-cases/delete-unity.use-case';

describe('UnityController', () => {
  let controller: UnityController;
  let createUnityUseCase: jest.Mocked<CreateUnityUseCase>;
  let findAllUnitiesUseCase: jest.Mocked<FindAllUnitiesUseCase>;
  let deleteUnityUseCase: jest.Mocked<DeleteUnityUseCase>;

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
    createUnityUseCase = module.get(CreateUnityUseCase);
    findAllUnitiesUseCase = module.get(FindAllUnitiesUseCase);
    deleteUnityUseCase = module.get(DeleteUnityUseCase);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a unity', async () => {
      const createDto = {
        name: 'Test Unity',
        address: '123 Test St',
      };

      createUnityUseCase.execute.mockResolvedValue();

      await controller.create(createDto);

      expect(createUnityUseCase.execute).toHaveBeenCalledWith(createDto);
    });
  });

  describe('findAll', () => {
    it('should return all unities', async () => {
      const expectedResult = [
        { id: '1', name: 'Unity 1', address: 'Address 1' },
        { id: '2', name: 'Unity 2', address: 'Address 2' },
      ];

      findAllUnitiesUseCase.execute.mockResolvedValue(expectedResult);

      const result = await controller.findAll();

      expect(result).toEqual(expectedResult);
      expect(findAllUnitiesUseCase.execute).toHaveBeenCalled();
    });
  });

  describe('delete', () => {
    it('should delete a unity', async () => {
      const deleteDto = { id: '123' };

      deleteUnityUseCase.execute.mockResolvedValue();

      await controller.delete(deleteDto);

      expect(deleteUnityUseCase.execute).toHaveBeenCalledWith(deleteDto.id);
    });
  });
});
