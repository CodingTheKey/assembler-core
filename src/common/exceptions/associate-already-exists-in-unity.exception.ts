import { BaseException } from './base.exception';

export class AssociateAlreadyExistsInUnityException extends BaseException {
  constructor({ cpf, cause = '' }: { cpf: string; cause?: unknown }) {
    super({
      name: 'Associate Already Exists in Unity',
      message: `Associate with CPF '${cpf}' already exists in the specified unity.`,
      statusCode: 409,
      cause,
    });
  }
}
