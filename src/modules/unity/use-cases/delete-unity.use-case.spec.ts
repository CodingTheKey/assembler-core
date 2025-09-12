import { UnityNotFoundException } from '../../../common/exceptions';
import { UnityRepositoryInterface } from '../repositories/unity.repository.interface';
import { DeleteUnityUseCase } from './delete-unity.use-case';
import { Unity } from '../entities/unity.entity';

describe('DeleteUnityUseCase', () => {
  let useCase: DeleteUnityUseCase;
  let unityRepository: jest.Mocked<UnityRepositoryInterface>;

  beforeEach(() => {
    unityRepository = {
      create: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      delete: jest.fn(),
    };

    useCase = new DeleteUnityUseCase(unityRepository);
  });

  it('should delete a unity successfully', async () => {
    const unityId = '123';
    const mockUnity = new Unity(unityId, 'Test Unity', '123 Test St', null);
    
    unityRepository.findById.mockResolvedValue(mockUnity);
    unityRepository.delete.mockResolvedValue();

    await useCase.execute(unityId);

    expect(unityRepository.findById).toHaveBeenCalledWith(unityId);
    expect(unityRepository.delete).toHaveBeenCalledWith(unityId);
  });

  it('should throw UnityNotFoundException when unity does not exist', async () => {
    const unityId = 'non-existent';
    
    unityRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute(unityId)).rejects.toThrow(UnityNotFoundException);
    expect(unityRepository.findById).toHaveBeenCalledWith(unityId);
  });
});