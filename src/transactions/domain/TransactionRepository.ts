import { Transaction } from './Transaction';

export interface TransactionRepository {
  get(transactionId: string): Promise<Transaction | null>;
}
