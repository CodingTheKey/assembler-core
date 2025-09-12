import { MeetingRepositoryInterface } from '../repositories/meeting.repository.interface';
import { CreateMeetingUseCase } from './create-meeting.use-case';
import { Meeting } from '../entities/meeting.entity';

describe('CreateMeetingUseCase', () => {
  let useCase: CreateMeetingUseCase;
  let meetingRepository: jest.Mocked<MeetingRepositoryInterface>;

  beforeEach(() => {
    meetingRepository = {
      create: jest.fn(),
      findById: jest.fn(),
    };

    useCase = new CreateMeetingUseCase(meetingRepository);
  });

  it('should create a meeting successfully', async () => {
    const createMeetingDto = {
      title: 'Monthly Meeting',
      description: 'Monthly team meeting',
      startDate: new Date('2024-12-15T10:00:00Z'),
      unityId: 'unity-123',
      location: 'Conference Room A',
      status: 'scheduled' as const,
    };

    const expectedMeeting = new Meeting(
      'meeting-123',
      createMeetingDto.title,
      createMeetingDto.description,
      'Unity Name',
      createMeetingDto.startDate,
      createMeetingDto.location,
      createMeetingDto.status,
    );

    meetingRepository.create.mockResolvedValue(expectedMeeting);

    const result = await useCase.execute(createMeetingDto);

    expect(result).toEqual(expectedMeeting);
    expect(meetingRepository.create).toHaveBeenCalledWith(expect.any(Meeting));
    
    const calledMeeting = meetingRepository.create.mock.calls[0][0];
    expect(calledMeeting.title).toBe(createMeetingDto.title);
    expect(calledMeeting.description).toBe(createMeetingDto.description);
    expect(calledMeeting.startDate).toBe(createMeetingDto.startDate);
    expect(calledMeeting.location).toBe(createMeetingDto.location);
    expect(calledMeeting.status).toBe(createMeetingDto.status);
  });
});