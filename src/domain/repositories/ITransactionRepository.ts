import { Transaction } from '../models/Transaction';

export interface ITransactionRepository {
  getTransactionById(transactionId: string): Promise<Transaction>;
  saveTransaction(transaction: Transaction): Promise<void>;
}
