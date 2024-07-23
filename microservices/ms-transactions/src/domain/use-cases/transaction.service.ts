import { Transaction } from '../entities/transaction.entity';

export interface ITransactionService {
  findById(transactionId: string): Promise<Transaction | null>;
}
