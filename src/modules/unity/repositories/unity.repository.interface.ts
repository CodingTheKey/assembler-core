import { Unity } from '../entities/unity.entity';

export interface UnityRepositoryInterface {
  create(unity: Unity): Promise<void>;
  findAll(): Promise<Unity[]>;
  findById(id: string): Promise<Unity | null>;
  delete(id: string): Promise<void>;
}
