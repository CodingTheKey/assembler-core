import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { CreateUnityDto } from '../dto/create-unity.dto';
import { DeleteUnityDto } from '../dto/delete-unity.dto';
import { CreateUnityUseCase } from '../use-cases/create-unity.use-case';
import { FindAllUnitiesUseCase } from '../use-cases/find-all-unities.use-case';
import { DeleteUnityUseCase } from '../use-cases/delete-unity.use-case';

@Controller('unities')
export class UnityController {
  constructor(
    private readonly createUnityUseCase: CreateUnityUseCase,
    private readonly findAllUnitiesUseCase: FindAllUnitiesUseCase,
    private readonly deleteUnityUseCase: DeleteUnityUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createUnityDto: CreateUnityDto): Promise<void> {
    await this.createUnityUseCase.execute(createUnityDto);
  }

  @Get()
  async findAll() {
    return await this.findAllUnitiesUseCase.execute();
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param() params: DeleteUnityDto): Promise<void> {
    await this.deleteUnityUseCase.execute(params.id);
  }
}
