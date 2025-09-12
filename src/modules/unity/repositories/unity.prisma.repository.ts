import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';
import { Unity } from '../entities/unity.entity';
import { UnityRepositoryInterface } from './unity.repository.interface';

@Injectable()
export class UnityPrismaRepository implements UnityRepositoryInterface {
  constructor(private readonly prisma: PrismaService) {}

  async create(unity: Unity): Promise<void> {
    await this.prisma.unity.create({
      data: {
        name: unity.name,
        address: unity.address,
        logoUrl: unity.logoUrl,
      },
    });
  }

  async findAll(): Promise<Unity[]> {
    const unities = await this.prisma.unity.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return unities.map(
      (unity) => new Unity(unity.id, unity.name, unity.address, unity.logoUrl),
    );
  }

  async findById(id: string): Promise<Unity | null> {
    const unity = await this.prisma.unity.findUnique({
      where: { id },
    });

    if (!unity) {
      return null;
    }

    return new Unity(unity.id, unity.name, unity.address, unity.logoUrl);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.unity.delete({
      where: { id },
    });
  }
}