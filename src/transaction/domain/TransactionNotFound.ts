export class TransactionNotFound extends Error {
  constructor(transactionId: string) {
    super(`Transaction with id ${transactionId} not found`);
  }
}