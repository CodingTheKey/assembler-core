import { BaseException } from './base.exception';

export class MeetingParticipantNotFoundException extends BaseException {
  constructor({
    meetingId,
    associateId,
    associateCpf,
    cause,
  }: {
    meetingId: string;
    associateId?: string;
    associateCpf?: string;
    cause?: unknown;
  }) {
    const identifier = associateCpf
      ? `CPF '${associateCpf}'`
      : associateId
        ? `id '${associateId}'`
        : 'unknown identifier';

    super({
      name: 'Meeting participant not found',
      message: `Associate with ${identifier} is not registered for meeting '${meetingId}'.`,
      statusCode: 404,
      cause,
    });
  }
}
