import { ITransactionService } from './ITransactionService';
import { Transaction } from '../../domain/models/Transaction';
import { ITransactionRepository } from '../../domain/repositories/ITransactionRepository';

export class TransactionService implements ITransactionService {
  constructor(private transactionRepository: ITransactionRepository) {}

  async fetchTransaction(transactionId: string): Promise<Transaction | null> {
    return await this.transactionRepository.getTransactionById(transactionId);
  }

  async processTransaction(transaction: Transaction): Promise<void> {
    return await this.transactionRepository.saveTransaction(transaction)
  }
}
