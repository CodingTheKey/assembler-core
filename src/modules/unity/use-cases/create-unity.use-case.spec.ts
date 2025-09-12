import { UnityRepositoryInterface } from '../repositories/unity.repository.interface';
import { CreateUnityUseCase } from './create-unity.use-case';
import { Unity } from '../entities/unity.entity';

describe('CreateUnityUseCase', () => {
  let useCase: CreateUnityUseCase;
  let unityRepository: jest.Mocked<UnityRepositoryInterface>;

  beforeEach(() => {
    unityRepository = {
      create: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      delete: jest.fn(),
    };

    useCase = new CreateUnityUseCase(unityRepository);
  });

  it('should create a unity successfully', async () => {
    const createUnityDto = {
      name: 'Test Unity',
      address: '123 Test St',
    };

    unityRepository.create.mockResolvedValue();

    await useCase.execute(createUnityDto);

    expect(unityRepository.create).toHaveBeenCalledWith(
      expect.any(Unity)
    );
    
    const calledUnity = unityRepository.create.mock.calls[0][0];
    expect(calledUnity.name).toBe(createUnityDto.name);
    expect(calledUnity.address).toBe(createUnityDto.address);
  });
});