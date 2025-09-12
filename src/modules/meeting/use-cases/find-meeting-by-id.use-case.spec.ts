import { MeetingRepositoryInterface } from '../repositories/meeting.repository.interface';
import { FindMeetingByIdUseCase } from './find-meeting-by-id.use-case';

describe('FindMeetingByIdUseCase', () => {
  let useCase: FindMeetingByIdUseCase;
  let meetingRepository: jest.Mocked<MeetingRepositoryInterface>;

  beforeEach(() => {
    meetingRepository = {
      create: jest.fn(),
      findById: jest.fn(),
    };

    useCase = new FindMeetingByIdUseCase(meetingRepository);
  });

  it('should return a meeting when found', async () => {
    const meetingId = '123';
    const expectedMeeting = {
      id: meetingId,
      title: 'Test Meeting',
      description: 'Test Description',
      scheduledAt: new Date('2024-12-15T10:00:00Z'),
      unityId: 'unity-123',
    };

    meetingRepository.findById.mockResolvedValue(expectedMeeting);

    const result = await useCase.execute(meetingId);

    expect(result).toEqual(expectedMeeting);
    expect(meetingRepository.findById).toHaveBeenCalledWith(meetingId);
  });

  it('should return null when meeting is not found', async () => {
    const meetingId = 'non-existent';
    
    meetingRepository.findById.mockResolvedValue(null);

    const result = await useCase.execute(meetingId);

    expect(result).toBeNull();
    expect(meetingRepository.findById).toHaveBeenCalledWith(meetingId);
  });
});