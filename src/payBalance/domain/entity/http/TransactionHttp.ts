export interface TransactionHttpModelDB {
  id: number;
  message: string;
}

export class TransactionHttp {
  private readonly _id: number;
  private readonly _message: string;

  constructor(model: TransactionHttpModelDB) {
    this._id = Number(model.id) ?? undefined;
    this._message = model.message;
  }

  public static create(model: TransactionHttpModelDB): TransactionHttp {
    return new TransactionHttp(model);
  }

  get id(): number {
    return this._id;
  }

  get message(): string {
    return this._message;
  }

  toData() {
    return {
      id: this.id,
      message: this.message,
    };
  }
}
