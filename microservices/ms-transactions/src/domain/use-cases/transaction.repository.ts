import { Transaction } from '../entities/transaction.entity';

export interface ITransactionRepository {
  findById(transactionId: string): Promise<Transaction | null>;
}
