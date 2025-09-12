import { Test, TestingModule } from '@nestjs/testing';
import { AssociateController } from './associate.controller';
import { CreateAssociateUseCase } from '../use-cases/create-associate.use-case';
import { FindAssociateByIdUseCase } from '../use-cases/find-associate-by-id.use-case';

describe('AssociateController', () => {
  let controller: AssociateController;
  let createAssociateUseCase: jest.Mocked<CreateAssociateUseCase>;
  let findAssociateByIdUseCase: jest.Mocked<FindAssociateByIdUseCase>;

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
    createAssociateUseCase = module.get(CreateAssociateUseCase);
    findAssociateByIdUseCase = module.get(FindAssociateByIdUseCase);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create an associate', async () => {
      const createDto = {
        name: 'John Doe',
        email: 'john@example.com',
        unityId: 'unity-123',
      };

      createAssociateUseCase.execute.mockResolvedValue();

      await controller.create(createDto);

      expect(createAssociateUseCase.execute).toHaveBeenCalledWith(createDto);
    });
  });

  describe('findById', () => {
    it('should find an associate by id', async () => {
      const associateId = '123';
      const expectedResult = {
        id: associateId,
        name: 'John Doe',
        email: 'john@example.com',
        unityId: 'unity-123',
      };

      findAssociateByIdUseCase.execute.mockResolvedValue(expectedResult);

      const result = await controller.findById({ id: associateId });

      expect(result).toEqual(expectedResult);
      expect(findAssociateByIdUseCase.execute).toHaveBeenCalledWith(associateId);
    });
  });
});
