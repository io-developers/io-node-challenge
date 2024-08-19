export interface TransactionService {
  getTransaction(transactionId: string): Promise<unknown>;
  createTransaction(userId: string, amount: number): Promise<string>;
}
