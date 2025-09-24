import { BaseException } from './base.exception';

export class MeetingNotFoundException extends BaseException {
  constructor({ id, cause }: { id: string; cause?: unknown }) {
    super({
      name: 'Meeting not found',
      message: `Meeting with id: ${id} not found`,
      statusCode: 409,
      cause,
    });
  }
}
