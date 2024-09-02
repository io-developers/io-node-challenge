export class Transaction {
  public id: string;
  public accountId: string;
  public amount: number;
  public type: string;
  public status: string;
  public createdAt: Date;

  constructor(
      id: string,
      accountId: string,
      amount: number,
      type: string,
      status: string,
      createdAt: Date
  ) {
    this.id = id;
    this.accountId = accountId;
    this.amount = amount;
    this.type = type;
    this.status = status;
    this.createdAt = createdAt;
  }
}
