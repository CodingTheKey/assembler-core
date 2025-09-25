import { Injectable } from '@nestjs/common';
import { UnityNotFoundException } from 'src/common/exceptions';
import { Associate } from 'src/modules/associate/entities/associate.entity';
import { PrismaService } from '../../../database/prisma.service';
import { Meeting, MeetingStatus } from '../entities/meeting.entity';
import type { MeetingRepositoryInterface } from './meeting.repository.interface';

@Injectable()
export class MeetingPrismaRepository implements MeetingRepositoryInterface {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<Meeting[]> {
    const meetings = await this.prisma.meeting.findMany({
      include: {
        unity: true,
        participants: {
          include: {
            associate: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return meetings.map(
      (meeting) =>
        new Meeting(
          meeting.id,
          meeting.title,
          meeting.description,
          meeting.unity.name,
          meeting.startDate,
          meeting.location || '',
          meeting.status.toLowerCase() as MeetingStatus,
          meeting.unityId,
        ),
    );
  }

  async create(meeting: Meeting): Promise<Meeting> {
    if (!meeting.unityId) {
      throw new Error('Unity id is required');
    }

    const unity = await this.prisma.unity.findUnique({
      where: { id: meeting.unityId },
    });

    if (!unity) {
      throw new UnityNotFoundException({
        unityId: meeting.unityId,
      });
    }

    const createdMeeting = await this.prisma.$transaction(async (tx) => {
      const [newMeeting, unityParticipants] = await Promise.all([
        tx.meeting.create({
          data: {
            title: meeting.title,
            description: meeting.description,
            unityId: meeting.unityId || '',
            startDate: meeting.startDate,
            location: meeting.location,
            status: meeting.status.toUpperCase() as
              | 'SCHEDULED'
              | 'CANCELED'
              | 'PAUSED'
              | 'FINISHED',
          },
          include: {
            unity: {
              select: { name: true },
            },
          },
        }),
        tx.associate.findMany({
          where: { unityId: meeting.unityId },
          select: { id: true },
        }),
      ]);

      if (unityParticipants.length > 0) {
        await tx.meetingParticipant.createMany({
          data: unityParticipants.map((participant) => ({
            meetingId: newMeeting.id,
            associateId: participant.id,
          })),
          skipDuplicates: true,
        });
      }

      return newMeeting;
    });

    return new Meeting(
      createdMeeting.id,
      createdMeeting.title,
      createdMeeting.description,
      createdMeeting.unity.name,
      createdMeeting.startDate,
      createdMeeting.location || '',
      createdMeeting.status.toLowerCase() as MeetingStatus,
      createdMeeting.unityId,
    );
  }

  async update(meeting: Meeting): Promise<Meeting> {
    const updatedMeeting = await this.prisma.meeting.update({
      where: { id: meeting.id },
      data: {
        title: meeting.title,
        description: meeting.description,
        startDate: meeting.startDate,
        location: meeting.location,
        status: meeting.status.toUpperCase() as
          | 'SCHEDULED'
          | 'CANCELED'
          | 'PAUSED'
          | 'FINISHED',
      },
      include: {
        unity: true,
      },
    });

    return new Meeting(
      updatedMeeting.id,
      updatedMeeting.title,
      updatedMeeting.description,
      updatedMeeting.unity.name,
      updatedMeeting.startDate,
      updatedMeeting.location || '',
      updatedMeeting.status.toLowerCase() as MeetingStatus,
      updatedMeeting.unityId,
    );
  }

  async delete(id: string): Promise<void> {
    await this.prisma.meeting.delete({
      where: { id },
    });
  }

  async countMeetings(): Promise<number> {
    return await this.prisma.meeting.count();
  }

  async startMeeting(meeting: Meeting): Promise<void> {
    await this.prisma.meeting.update({
      where: { id: meeting.id },
      data: {
        status: 'STARTED',
      },
    });
  }

  async findById(id: string): Promise<Meeting | null> {
    const result = await this.prisma.meeting.findUnique({
      where: { id },
      include: {
        unity: true,
        participants: {
          include: {
            associate: true,
          },
        },
      },
    });

    if (!result) {
      return null;
    }

    const meeting = new Meeting(
      result.id,
      result.title,
      result.description,
      result.unity.name,
      result.startDate,
      result.location || '',
      result.status.toLowerCase() as MeetingStatus,
      result.unityId,
    );

    result.participants.forEach((p) => {
      meeting.addParticipant(
        new Associate(
          p.associate.id,
          p.associate.name,
          p.associate.address,
          true,
          p.associate.associatedUnityName,
          p.associate.email,
          p.associate.urlImage,
          p.associate.gender,
          p.associate.birthDate,
          p.associate.nationality,
          p.associate.placeOfBirth,
          p.associate.number,
          p.associate.neighborhood,
          p.associate.city,
          p.associate.zipCode,
          p.associate.cellPhone,
          p.associate.rg,
          p.associate.cpf,
          p.associate.isSpecialNeeds,
          p.associate.voterRegistrationNumber,
          p.associate.electoralZone,
          p.associate.electoralSection,
          p.associate.maritalStatus,
          p.associate.unityId,
        ),
      );
    });

    return meeting;
  }
}
