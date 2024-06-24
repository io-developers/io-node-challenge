import { Transaction } from '../models/Transaction';

export interface ITransactionRepository {
  getTransactionById(transactionId: string): Promise<Transaction | null>;
  saveTransaction(transaction: Transaction): Promise<void>;

}
