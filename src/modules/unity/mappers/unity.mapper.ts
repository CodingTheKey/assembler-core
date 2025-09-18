import { Unity } from '../entities/unity.entity';

export class UnityMapper {
  static map(unity: Unity) {
    return {
      id: unity.id,
      name: unity.name,
      address: unity.address,
      logoUrl: unity.logoUrl,
    };
  }

  static mapMany(unities: Unity[]) {
    return unities.map((unity) => this.map(unity));
  }
}
