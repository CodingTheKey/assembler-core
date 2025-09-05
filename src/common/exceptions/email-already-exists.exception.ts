import { BaseException } from './base.exception';

export class EmailAlreadyExistsException extends BaseException {
  constructor({ email, cause }: { email: string; cause?: unknown }) {
    super({
      name: 'Email Already Exists',
      message: `Email '${email}' already exists in the system`,
      statusCode: 409,
      cause,
    });
  }
}
