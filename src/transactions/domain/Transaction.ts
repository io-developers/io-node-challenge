export class Transaction {
  transactionId: string;
  userId: string;
  paymentAmount: number;

  constructor(transactionId: string, userId: string, paymentAmount: number) {
    this.transactionId = transactionId;
    this.userId = userId;
    this.paymentAmount = paymentAmount;
  }
}
