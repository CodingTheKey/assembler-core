export abstract class BaseEntity {
  protected _id: string;

  constructor(id: string) {
    this._id = id;
  }

  get id(): string {
    return this._id;
  }

  equals(entity: BaseEntity): boolean {
    return this._id === entity._id;
  }
}
