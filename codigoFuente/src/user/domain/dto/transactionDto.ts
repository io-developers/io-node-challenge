export class TransactionDTO {
  public readonly userId: string;
  public readonly paymentAmount: number;

  constructor(userId: string, paymentAmount: number) {
    this.userId = userId;
    this.paymentAmount = paymentAmount;
  }
}
