import { Test, TestingModule } from '@nestjs/testing';
import { CreateAssociateUseCase } from './create-associate.use-case';

describe('CreateAssociateUseCase', () => {
  let useCase: CreateAssociateUseCase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateAssociateUseCase,
        {
          provide: 'AssociateRepositoryInterface',
          useValue: {
            create: jest.fn(),
            findAssociateExistingAssociateInUnity: jest.fn(),
          },
        },
      ],
    }).compile();

    useCase = module.get<CreateAssociateUseCase>(CreateAssociateUseCase);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });
});
