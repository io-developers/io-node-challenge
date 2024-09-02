export class Account {
  public id: string;
  public ownerId: string;
  public balance: number;
  public status: string;
  public createdAt: Date;
  public updatedAt: Date;

  constructor(
      id: string,
      ownerId: string,
      balance: number,
      status: string,
      createdAt: Date,
      updatedAt: Date
  ) {
    this.id = id;
    this.ownerId = ownerId;
    this.balance = balance;
    this.status = status;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}
