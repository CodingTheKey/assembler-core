import { Test, TestingModule } from '@nestjs/testing';
import { MeetingController } from './meeting.controller';
import { CreateMeetingUseCase } from '../use-cases/create-meeting.use-case';
import { FindMeetingByIdUseCase } from '../use-cases/find-meeting-by-id.use-case';

describe('MeetingController', () => {
  let controller: MeetingController;
  let createMeetingUseCase: jest.Mocked<CreateMeetingUseCase>;
  let findMeetingByIdUseCase: jest.Mocked<FindMeetingByIdUseCase>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MeetingController],
      providers: [
        {
          provide: CreateMeetingUseCase,
          useValue: {
            execute: jest.fn(),
          },
        },
        {
          provide: FindMeetingByIdUseCase,
          useValue: {
            execute: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<MeetingController>(MeetingController);
    createMeetingUseCase = module.get(CreateMeetingUseCase);
    findMeetingByIdUseCase = module.get(FindMeetingByIdUseCase);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a meeting', async () => {
      const createDto = {
        title: 'Monthly Meeting',
        description: 'Monthly team meeting',
        startDate: new Date('2024-12-15T10:00:00Z'),
        unityId: 'unity-123',
        location: 'Conference Room A',
        status: 'scheduled' as const,
      };

      const expectedResult = {
        id: 'meeting-123',
        title: createDto.title,
        description: createDto.description,
        startDate: createDto.startDate,
        location: createDto.location,
        status: createDto.status,
        unityName: 'Unity Name',
      };

      createMeetingUseCase.execute.mockResolvedValue(expectedResult as any);

      const result = await controller.create(createDto);

      expect(result).toEqual(expectedResult);
      expect(createMeetingUseCase.execute).toHaveBeenCalledWith(createDto);
    });
  });

  describe('findById', () => {
    it('should find a meeting by id', async () => {
      const meetingId = '123';
      const expectedResult = {
        id: meetingId,
        title: 'Test Meeting',
        description: 'Test Description',
        startDate: new Date('2024-12-15T10:00:00Z'),
        location: 'Conference Room A',
        status: 'scheduled' as const,
        unityName: 'Unity Name',
      };

      findMeetingByIdUseCase.execute.mockResolvedValue(expectedResult as any);

      const result = await controller.findById({ id: meetingId });

      expect(result).toEqual(expectedResult);
      expect(findMeetingByIdUseCase.execute).toHaveBeenCalledWith(meetingId);
    });
  });
});
