import {
  Body,
  Controller,
  Get,
  Put,
  Delete,
  Param,
  Post,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { CreateAssociateDto } from '../dto/create-associate.dto';
import { AssociateByIdDto } from '../dto/associate-by-id.dto';
import { CreateAssociateUseCase } from '../use-cases/create-associate.use-case';
import { FindAssociateByIdUseCase } from '../use-cases/find-associate-by-id.use-case';
import { FindAssociatesByUnityUseCase } from '../use-cases/find-associates-by-unity.use-case';
import { EditAssociateUseCase } from '../use-cases/edit-associate.use-case';
import { DeactivateAssociateUseCase } from '../use-cases/deactivate-associate.use-case';
import { AssociatesByUnityDto } from '../dto/associates-by-unity.dto';
import { EditAssociateDto } from '../dto/edit-associate.dto';
import { DeleteAssociateDto } from '../dto/delete-associate.dto';

@Controller('associates')
export class AssociateController {
  constructor(
    private readonly createAssociateUseCase: CreateAssociateUseCase,
    private readonly findAssociateByIdUseCase: FindAssociateByIdUseCase,
    private readonly findAssociatesByUnityUseCase: FindAssociatesByUnityUseCase,
    private readonly editAssociateUseCase: EditAssociateUseCase,
    private readonly deactivateAssociateUseCase: DeactivateAssociateUseCase,
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

  @Get('unity/:unityId')
  async findByUnity(@Param() params: AssociatesByUnityDto) {
    return await this.findAssociatesByUnityUseCase.execute(params.unityId);
  }

  @Put(':id')
  async edit(
    @Param() params: AssociateByIdDto,
    @Body() body: EditAssociateDto,
  ): Promise<void> {
    await this.editAssociateUseCase.execute({ ...body, id: params.id });
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param() params: DeleteAssociateDto): Promise<void> {
    await this.deactivateAssociateUseCase.execute(params.id);
  }
}
