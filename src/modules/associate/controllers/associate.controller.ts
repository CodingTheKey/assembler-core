import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { CreateAssociateDto } from '../dto/create-associate.dto';
import { AssociateByIdDto } from '../dto/associate-by-id.dto';
import { CreateAssociateUseCase } from '../use-cases/create-associate.use-case';
import { FindAssociateByIdUseCase } from '../use-cases/find-associate-by-id.use-case';

@Controller('associates')
export class AssociateController {
  constructor(
    private readonly createAssociateUseCase: CreateAssociateUseCase,
    private readonly findAssociateByIdUseCase: FindAssociateByIdUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createAssociateDto: CreateAssociateDto): Promise<void> {
    await this.createAssociateUseCase.execute(createAssociateDto);
  }

  @Get(':id')
  async findById(@Param() params: AssociateByIdDto) {
    return await this.findAssociateByIdUseCase.execute(params.id);
  }
}
