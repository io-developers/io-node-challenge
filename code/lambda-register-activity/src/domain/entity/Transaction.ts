export class Transaction {
  constructor(
    public transactionId: string,
    public userId: string,
    public paymentAmount: string,
  ) {}
}
