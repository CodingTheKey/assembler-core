import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';
import { Associate } from '../entities/associate.entity';
import type { AssociateRepositoryInterface } from './associate.repository.interface';

@Injectable()
export class AssociatePrismaRepository implements AssociateRepositoryInterface {
  constructor(private readonly prisma: PrismaService) {}

  async create(associate: Associate): Promise<void> {
    await this.prisma.associate.create({
      data: {
        name: associate.name,
        address: associate.address,
        isActive: associate.isActive,
        associatedUnityName: associate.associatedUnityName,
        email: associate.email,
        urlImage: associate.urlImage,
        gender: associate.gender,
        birthDate: associate.birthDate,
        nationality: associate.nationality,
        placeOfBirth: associate.placeOfBirth,
        number: associate.number,
        neighborhood: associate.neighborhood,
        city: associate.city,
        zipCode: associate.zipCode,
        cellPhone: associate.cellPhone,
        rg: associate.rg,
        cpf: associate.cpf,
        isSpecialNeeds: associate.isSpecialNeeds,
        voterRegistrationNumber: associate.voterRegistrationNumber,
        electoralZone: associate.electoralZone,
        electoralSection: associate.electoralSection,
        maritalStatus: associate.maritalStatus,
        unityId: associate.unityId,
      },
    });
  }

  async findById(id: string): Promise<Associate | null> {
    const associate = await this.prisma.associate.findUnique({
      where: { id },
      include: {
        unity: true,
      },
    });

    if (!associate) {
      return null;
    }

    return new Associate(
      associate.id,
      associate.name,
      associate.address,
      associate.isActive,
      associate.associatedUnityName,
      associate.email,
      associate.urlImage,
      associate.gender,
      associate.birthDate,
      associate.nationality,
      associate.placeOfBirth,
      associate.number,
      associate.neighborhood,
      associate.city,
      associate.zipCode,
      associate.cellPhone,
      associate.rg,
      associate.cpf,
      associate.isSpecialNeeds,
      associate.voterRegistrationNumber,
      associate.electoralZone,
      associate.electoralSection,
      associate.maritalStatus,
      associate.unityId,
    );
  }

  async update(associate: Associate): Promise<void> {
    await this.prisma.associate.update({
      where: { id: associate.id },
      data: {
        name: associate.name,
        address: associate.address,
        isActive: associate.isActive,
        associatedUnityName: associate.associatedUnityName,
        email: associate.email,
        urlImage: associate.urlImage,
        gender: associate.gender,
        birthDate: associate.birthDate,
        nationality: associate.nationality,
        placeOfBirth: associate.placeOfBirth,
        number: associate.number,
        neighborhood: associate.neighborhood,
        city: associate.city,
        zipCode: associate.zipCode,
        cellPhone: associate.cellPhone,
        rg: associate.rg,
        cpf: associate.cpf,
        isSpecialNeeds: associate.isSpecialNeeds,
        voterRegistrationNumber: associate.voterRegistrationNumber,
        electoralZone: associate.electoralZone,
        electoralSection: associate.electoralSection,
        maritalStatus: associate.maritalStatus,
        unityId: associate.unityId,
      },
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.associate.delete({
      where: { id },
    });
  }

  async findAll(): Promise<Associate[]> {
    const associates = await this.prisma.associate.findMany({
      include: {
        unity: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return associates.map(
      (associate) =>
        new Associate(
          associate.id,
          associate.name,
          associate.address,
          associate.isActive,
          associate.associatedUnityName,
          associate.email,
          associate.urlImage,
          associate.gender,
          associate.birthDate,
          associate.nationality,
          associate.placeOfBirth,
          associate.number,
          associate.neighborhood,
          associate.city,
          associate.zipCode,
          associate.cellPhone,
          associate.rg,
          associate.cpf,
          associate.isSpecialNeeds,
          associate.voterRegistrationNumber,
          associate.electoralZone,
          associate.electoralSection,
          associate.maritalStatus,
          associate.unityId,
        ),
    );
  }

  async findByUnityId(unityId: string): Promise<Associate[]> {
    const associates = await this.prisma.associate.findMany({
      where: { unityId },
      include: {
        unity: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return associates.map(
      (associate) =>
        new Associate(
          associate.id,
          associate.name,
          associate.address,
          associate.isActive,
          associate.associatedUnityName,
          associate.email,
          associate.urlImage,
          associate.gender,
          associate.birthDate,
          associate.nationality,
          associate.placeOfBirth,
          associate.number,
          associate.neighborhood,
          associate.city,
          associate.zipCode,
          associate.cellPhone,
          associate.rg,
          associate.cpf,
          associate.isSpecialNeeds,
          associate.voterRegistrationNumber,
          associate.electoralZone,
          associate.electoralSection,
          associate.maritalStatus,
          associate.unityId,
        ),
    );
  }

  async findAssociateExistingAssociateInUnity(
    cpf: string,
    unityId: string,
  ): Promise<Associate | null> {
    const associate = await this.prisma.associate.findFirst({
      where: {
        cpf,
        unityId,
      },
      include: {
        unity: true,
      },
    });

    if (!associate) {
      return null;
    }

    return new Associate(
      associate.id,
      associate.name,
      associate.address,
      associate.isActive,
      associate.associatedUnityName,
      associate.email,
      associate.urlImage,
      associate.gender,
      associate.birthDate,
      associate.nationality,
      associate.placeOfBirth,
      associate.number,
      associate.neighborhood,
      associate.city,
      associate.zipCode,
      associate.cellPhone,
      associate.rg,
      associate.cpf,
      associate.isSpecialNeeds,
      associate.voterRegistrationNumber,
      associate.electoralZone,
      associate.electoralSection,
      associate.maritalStatus,
      associate.unityId,
    );
  }
}
