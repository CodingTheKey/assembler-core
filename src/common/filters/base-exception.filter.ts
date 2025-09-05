import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import { BaseException } from '../exceptions/base.exception';

@Catch(BaseException)
export class BaseExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(BaseExceptionFilter.name);

  catch(exception: BaseException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const status = exception.statusCode || HttpStatus.INTERNAL_SERVER_ERROR;

    this.logger.error(
      `${exception.name}: ${exception.message}`,
      exception.stack,
    );

    response.status(status).json({
      error: {
        name: exception.name,
        message: exception.message,
        ...(exception.cause ? { cause: exception.cause } : {}),
      },
    });
  }
}
