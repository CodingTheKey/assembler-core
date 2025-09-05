import { Test, TestingModule } from '@nestjs/testing';
import { MeetingController } from './meeting.controller';
import { CreateMeetingUseCase } from '../use-cases/create-meeting.use-case';
import { FindMeetingByIdUseCase } from '../use-cases/find-meeting-by-id.use-case';

describe('MeetingController', () => {
  let controller: MeetingController;

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
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
