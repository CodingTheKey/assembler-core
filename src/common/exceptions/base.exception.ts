export interface BaseExceptionType {
  name: string;
  message: string;
  cause?: unknown;
  statusCode?: number;
}

export class BaseException extends Error {
  public statusCode: number;

  constructor({ name, message, cause, statusCode = 500 }: BaseExceptionType) {
    super(message);

    this.name = name;
    this.message = message;
    this.statusCode = statusCode;
    this.cause = cause;
  }
}
