import { AssociateNotFound } from '../../../common/exceptions/associate-not-found.exception';
import { AssociateRepositoryInterface } from '../repositories/associate.repository.interface';
import { FindAssociateByIdUseCase } from './find-associate-by-id.use-case';

describe('FindAssociateByIdUseCase', () => {
  let useCase: FindAssociateByIdUseCase;
  let associateRepository: jest.Mocked<AssociateRepositoryInterface>;

  beforeEach(() => {
    associateRepository = {
      create: jest.fn(),
      findById: jest.fn(),
    };

    useCase = new FindAssociateByIdUseCase(associateRepository);
  });

  it('should return an associate when found', async () => {
    const associateId = '123';
    const expectedAssociate = {
      id: associateId,
      name: 'John Doe',
      email: 'john@example.com',
      unityId: 'unity1',
    };

    associateRepository.findById.mockResolvedValue(expectedAssociate);

    const result = await useCase.execute(associateId);

    expect(result).toEqual(expectedAssociate);
    expect(associateRepository.findById).toHaveBeenCalledWith(associateId);
  });

  it('should throw AssociateNotFound when associate is not found', async () => {
    const associateId = 'non-existent';
    
    associateRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute(associateId)).rejects.toThrow(AssociateNotFound);
    expect(associateRepository.findById).toHaveBeenCalledWith(associateId);
  });
});