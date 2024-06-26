import { Transaction } from '../../domain/models/Transaction';

export interface ITransactionService {
  fetchTransaction(transactionId: string): Promise<Transaction | null>;
}
