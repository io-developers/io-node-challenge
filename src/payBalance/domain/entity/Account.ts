export interface AccountModelDB {
  id: string;
  amount: number;
}

export class Account {
  private readonly _id: string;
  private readonly _amount: number;

  constructor(model: AccountModelDB) {
    this._id = model.id;
    this._amount = model.amount;
  }

  public static create(model: AccountModelDB): Account {
    return new Account(model);
  }

  get id(): string {
    return this._id;
  }

  get amount(): number {
    return this._amount;
  }

  toData() {
    return {
      id: this.id,
      amount: this.amount,
    }
  }
}
