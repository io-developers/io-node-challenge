export class Transaction {
  readonly userId: string;
  readonly paymentAmount: number;

  constructor(userId: string, paymentAmount: number) {
    this.userId = userId;
    this.paymentAmount = paymentAmount;
  }
}
