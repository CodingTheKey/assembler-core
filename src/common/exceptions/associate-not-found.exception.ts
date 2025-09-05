import { BaseException } from './base.exception';

export class AssociateNotFoundException extends BaseException {
  constructor({
    associateId,
    cause = '',
  }: {
    associateId: string;
    cause?: unknown;
  }) {
    super({
      name: 'Associate Does Not Exist',
      message: `Associate with ID '${associateId}' does not exist.`,
      statusCode: 404,
      cause,
    });
  }
}
