export class Payment {
  userId: string;
  amount: number;
  transactionId: string;

  constructor(userId: string, amount: number) {
    this.userId = userId;
    this.amount = amount;
    this.transactionId = this.generateTransactionId();
  }

  private generateTransactionId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}
