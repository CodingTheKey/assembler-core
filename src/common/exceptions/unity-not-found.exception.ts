import { BaseException } from './base.exception';

export class UnityNotFoundException extends BaseException {
  constructor({
    unityId,
    unityName = '',
    cause = '',
  }: {
    unityId: string;
    unityName?: string;
    cause?: unknown;
  }) {
    super({
      name: 'Unity Not Found',
      message: `Unity '${unityName}' (ID: ${unityId}) not found`,
      statusCode: 404,
      cause,
    });
  }
}
