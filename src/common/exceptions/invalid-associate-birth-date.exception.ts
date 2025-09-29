import { BaseException } from './base.exception';

export class InvalidAssociateBirthDateException extends BaseException {
  constructor(birthDate: string) {
    super({
      name: 'Invalid Associate Birth Date',
      message: `Birth date '${birthDate}' is invalid.`,
      statusCode: 400,
    });
  }
}
