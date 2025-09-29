import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { CreateMeetingDto } from '../dto/create-meeting.dto';
import { FindMeetingByIdDto } from '../dto/find-by-id.dto';
import { StartMeetingDto } from '../dto/start-meeting.dto';
import { MeetingMap } from '../mappers/meeting.map';
import { CountMeetingsUseCase } from '../use-cases/count-meetings.use-case';
import { CreateMeetingUseCase } from '../use-cases/create-meeting.use-case';
import { FindMeetingByIdUseCase } from '../use-cases/find-meeting-by-id.use-case';
import { ListMeetingsUseCase } from '../use-cases/list-meetings.use-case';
import { StartMeetingUseCase } from '../use-cases/start-meeting.use-case';

@Controller('meetings')
export class MeetingController {
  constructor(
    private readonly createMeetingUseCase: CreateMeetingUseCase,
    private readonly findMeetingByIdUseCase: FindMeetingByIdUseCase,
    private readonly listMeetingsUseCase: ListMeetingsUseCase,
    private readonly countMeetingsUseCase: CountMeetingsUseCase,
    private readonly startMeetingUseCase: StartMeetingUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createMeetingDto: CreateMeetingDto) {
    const meeting = await this.createMeetingUseCase.execute(createMeetingDto);
    return MeetingMap.map(meeting);
  }

  @Get('count')
  async count() {
    const count = await this.countMeetingsUseCase.execute();
    return { count };
  }

  @Get(':id')
  async findById(@Param() params: FindMeetingByIdDto) {
    const meeting = await this.findMeetingByIdUseCase.execute(params.id);
    if (!meeting) {
      return null;
    }
    return MeetingMap.map(meeting);
  }

  @Get()
  async findAll() {
    const meetings = await this.listMeetingsUseCase.execute();
    return MeetingMap.mapMany(meetings);
  }

  @Post(':id/start')
  @HttpCode(HttpStatus.OK)
  async start(@Param() params: StartMeetingDto): Promise<{ success: boolean }> {
    return await this.startMeetingUseCase.execute(params.id);
  }
}
