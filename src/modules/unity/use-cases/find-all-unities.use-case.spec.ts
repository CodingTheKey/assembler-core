import { UnityRepositoryInterface } from '../repositories/unity.repository.interface';
import { FindAllUnitiesUseCase } from './find-all-unities.use-case';

describe('FindAllUnitiesUseCase', () => {
  let useCase: FindAllUnitiesUseCase;
  let unityRepository: jest.Mocked<UnityRepositoryInterface>;

  beforeEach(() => {
    unityRepository = {
      create: jest.fn(),
      findAll: jest.fn(),
      delete: jest.fn(),
    };

    useCase = new FindAllUnitiesUseCase(unityRepository);
  });

  it('should return all unities', async () => {
    const expectedUnities = [
      { id: '1', name: 'Unity 1', address: 'Address 1' },
      { id: '2', name: 'Unity 2', address: 'Address 2' },
    ];

    unityRepository.findAll.mockResolvedValue(expectedUnities);

    const result = await useCase.execute();

    expect(result).toEqual(expectedUnities);
    expect(unityRepository.findAll).toHaveBeenCalled();
  });

  it('should return empty array when no unities exist', async () => {
    unityRepository.findAll.mockResolvedValue([]);

    const result = await useCase.execute();

    expect(result).toEqual([]);
    expect(unityRepository.findAll).toHaveBeenCalled();
  });
});