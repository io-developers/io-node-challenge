export class TransactionDTO {
  public transactionId: string;
  public userId: string;
  public paymentAmount: number;

  constructor(transactionId: string, userId: string, paymentAmount: number) {
    this.transactionId = transactionId;
    this.userId = userId;
    this.paymentAmount = paymentAmount;
  }
}
