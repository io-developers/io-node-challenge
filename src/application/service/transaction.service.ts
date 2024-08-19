export interface TransactionService {
  getTransaction(transactionId: string): Promise<any>;
  createTransaction(userId: string, amount: number): Promise<string>;
}
