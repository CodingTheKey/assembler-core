import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Response } from 'express';
import { memoryStorage } from 'multer';
import { AssociateByIdDto } from '../dto/associate-by-id.dto';
import { AssociatesByUnityDto } from '../dto/associates-by-unity.dto';
import { CreateAssociateDto } from '../dto/create-associate.dto';
import { DeleteAssociateDto } from '../dto/delete-associate.dto';
import { EditAssociateDto } from '../dto/edit-associate.dto';
import { Associate } from '../entities/associate.entity';
import { CreateAssociateUseCase } from '../use-cases/create-associate.use-case';
import { DeactivateAssociateUseCase } from '../use-cases/deactivate-associate.use-case';
import { DeleteAssociateUseCase } from '../use-cases/delete-associate.use-case';
import { EditAssociateUseCase } from '../use-cases/edit-associate.use-case';
import { FindAssociateByIdUseCase } from '../use-cases/find-associate-by-id.use-case';
import { FindAssociatesByUnityUseCase } from '../use-cases/find-associates-by-unity.use-case';
import { GenerateAssociatePdfUseCase } from '../use-cases/generate-associate-pdf.use-case';

@Controller('associates')
export class AssociateController {
  constructor(
    private readonly createAssociateUseCase: CreateAssociateUseCase,
    private readonly findAssociateByIdUseCase: FindAssociateByIdUseCase,
    private readonly findAssociatesByUnityUseCase: FindAssociatesByUnityUseCase,
    private readonly editAssociateUseCase: EditAssociateUseCase,
    private readonly deactivateAssociateUseCase: DeactivateAssociateUseCase,
    private readonly deleteAssociateUseCase: DeleteAssociateUseCase,
    private readonly generateAssociatePdfUseCase: GenerateAssociatePdfUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(
    FileInterceptor('image', {
      storage: memoryStorage(),
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
        fieldSize: 2 * 1024 * 1024, // 2MB for text fields
      },
      fileFilter: (_, file, callback) => {
        if (!file || !file.mimetype) {
          return callback(null, true); // Allow requests without files
        }
        if (!file.mimetype.match(/\/(jpg|jpeg|png|gif|webp)$/)) {
          const error = new Error(
            'Apenas imagens são aceitas (jpg, jpeg, png, gif, webp)',
          );
          return callback(error, false);
        }
        callback(null, true);
      },
    }),
  )
  async create(
    @Body() createAssociateDto: CreateAssociateDto,
    @UploadedFile() image?: Express.Multer.File,
  ): Promise<void> {
    if (image && image.size > 5 * 1024 * 1024) {
      throw new BadRequestException('Arquivo muito grande. Máximo 5MB.');
    }

    await this.createAssociateUseCase.execute({
      ...createAssociateDto,
      image,
    });
  }

  @Get(':id')
  async findById(@Param() params: AssociateByIdDto) {
    return await this.findAssociateByIdUseCase.execute(params.id);
  }

  @Get('unity/:unityId')
  async findByUnity(
    @Param() params: AssociatesByUnityDto,
    @Query('search') search,
  ) {
    return await this.findAssociatesByUnityUseCase.execute(
      params.unityId,
      search,
    );
  }

  @Put(':id')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: memoryStorage(),
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
        fieldSize: 2 * 1024 * 1024, // 2MB for text fields
      },
      fileFilter: (_, file, callback) => {
        if (!file || !file.mimetype) {
          return callback(null, true); // Allow requests without files
        }
        if (!file.mimetype.match(/\/(jpg|jpeg|png|gif|webp)$/)) {
          const error = new Error(
            'Apenas imagens são aceitas (jpg, jpeg, png, gif, webp)',
          );
          return callback(error, false);
        }
        callback(null, true);
      },
    }),
  )
  async edit(
    @Param() params: AssociateByIdDto,
    @Body() body: EditAssociateDto,
    @UploadedFile() image?: Express.Multer.File,
  ): Promise<void> {
    await this.editAssociateUseCase.execute({ ...body, id: params.id, image });
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param() params: DeleteAssociateDto): Promise<void> {
    await this.deactivateAssociateUseCase.execute(params.id);
  }

  @Delete(':id/permanent')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deletePermanently(@Param() params: DeleteAssociateDto): Promise<void> {
    await this.deleteAssociateUseCase.execute(params.id);
  }

  @Get(':id/pdf')
  async generatePdf(
    @Param() params: AssociateByIdDto,
    @Res() res: Response,
  ): Promise<void> {
    const associateData = await this.findAssociateByIdUseCase.execute(
      params.id,
    );

    if (!associateData) {
      throw new NotFoundException('Associate not found');
    }

    // Converter DTO para entidade Associate
    const associate = new Associate(
      associateData.id,
      associateData.name,
      associateData.address,
      associateData.isActive,
      associateData.associatedUnityName,
      associateData.email,
      associateData.urlImage,
      associateData.gender || '',
      associateData.birthDate || new Date(),
      associateData.nationality || '',
      associateData.placeOfBirth || '',
      associateData.number || '',
      associateData.neighborhood || '',
      associateData.city || '',
      associateData.zipCode || '',
      associateData.cellPhone || '',
      associateData.rg || '',
      associateData.cpf,
      associateData.isSpecialNeeds,
      associateData.voterRegistrationNumber || '',
      associateData.electoralZone || '',
      associateData.electoralSection || '',
      associateData.maritalStatus || '',
      associateData.unityId,
      associateData.deletedAt,
    );

    const pdfBytes = await this.generateAssociatePdfUseCase.execute(associate);

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="associate-${associate.id}.pdf"`,
      'Content-Length': pdfBytes.length.toString(),
    });

    res.end(Buffer.from(pdfBytes));
  }
}
