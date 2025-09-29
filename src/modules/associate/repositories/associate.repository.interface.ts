import { Associate } from '../entities/associate.entity';

export interface AssociateRepositoryInterface {
  create(associate: Associate): Promise<void>;
  findById(id: string): Promise<Associate | null>;
  update(associate: Partial<Associate>): Promise<void>;
  delete(id: string): Promise<void>;
  findAll(): Promise<Associate[]>;
  findByUnityId(unityId: string, search?: string): Promise<Associate[]>;
  findAssociateExistingAssociateInUnity(
    cpf: string,
    unityId: string,
  ): Promise<Associate | null>;
}
