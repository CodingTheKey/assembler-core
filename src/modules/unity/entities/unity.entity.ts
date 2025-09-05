import { BaseEntity } from '../../../common/entities/base.entity';

export class Unity extends BaseEntity {
  constructor(
    protected _id: string,
    public name: string,
    public address: string,
    public logoUrl: string | null = null,
  ) {
    super(_id);
  }
}
