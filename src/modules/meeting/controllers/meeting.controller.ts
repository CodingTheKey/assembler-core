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
import { CreateMeetingUseCase } from '../use-cases/create-meeting.use-case';
import { FindMeetingByIdUseCase } from '../use-cases/find-meeting-by-id.use-case';

@Controller('meetings')
export class MeetingController {
  constructor(
    private readonly createMeetingUseCase: CreateMeetingUseCase,
    private readonly findMeetingByIdUseCase: FindMeetingByIdUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createMeetingDto: CreateMeetingDto) {
    return await this.createMeetingUseCase.execute(createMeetingDto);
  }

  @Get(':id')
  async findById(@Param() params: FindMeetingByIdDto) {
    return await this.findMeetingByIdUseCase.execute(params.id);
  }
}
