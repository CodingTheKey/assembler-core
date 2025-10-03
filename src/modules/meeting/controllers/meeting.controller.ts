import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { CreateMeetingDto } from '../dto/create-meeting.dto';
import { FindMeetingByIdDto } from '../dto/find-by-id.dto';
import { CheckInMeetingParticipantParamsDto } from '../dto/check-in-meeting-participant.dto';
import { CreateMeetingUseCase } from '../use-cases/create-meeting.use-case';
import { FindMeetingByIdUseCase } from '../use-cases/find-meeting-by-id.use-case';
import { ListMeetingsUseCase } from '../use-cases/list-meetings.use-case';
import { CountMeetingsUseCase } from '../use-cases/count-meetings.use-case';
import { StartMeetingUseCase } from '../use-cases/start-meeting.use-case';
import { CheckInMeetingParticipantUseCase } from '../use-cases/check-in-meeting-participant.use-case';
import { StartMeetingDto } from '../dto/start-meeting.dto';
import { MeetingMap } from '../mappers/meeting.map';

@Controller('meetings')
export class MeetingController {
  constructor(
    private readonly createMeetingUseCase: CreateMeetingUseCase,
    private readonly findMeetingByIdUseCase: FindMeetingByIdUseCase,
    private readonly listMeetingsUseCase: ListMeetingsUseCase,
    private readonly countMeetingsUseCase: CountMeetingsUseCase,
    private readonly startMeetingUseCase: StartMeetingUseCase,
    private readonly checkInMeetingParticipantUseCase: CheckInMeetingParticipantUseCase,
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
  @HttpCode(HttpStatus.NO_CONTENT)
  async start(@Param() params: StartMeetingDto): Promise<void> {
    await this.startMeetingUseCase.execute(params.id);
  }

  @Post(':meetingId/participants/:cpf/check-in')
  @HttpCode(HttpStatus.OK)
  async checkIn(
    @Param() params: CheckInMeetingParticipantParamsDto,
  ): Promise<{ message: string }> {
    await this.checkInMeetingParticipantUseCase.execute(
      params.meetingId,
      params.cpf,
    );

    return { message: 'Check-in realizado com sucesso.' };
  }
}
