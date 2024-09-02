import { Transaction } from '../entity/Transaction';

export interface ITransactionRepository {
  getTransactionById(transactionId: string): Promise<Transaction | null>;
}
