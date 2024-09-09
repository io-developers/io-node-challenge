export class TransactionDataVo {
  accountId: string;
  amount: number;

  constructor(accountId: string, amount: number) {
    this.accountId = accountId;
    this.amount = amount;
  }
}
