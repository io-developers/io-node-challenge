import { Transaction } from '../domain/Transaction';
import { TransactionRepository } from '../domain/TransactionRepository';

export class TransactionService {
  private transactionRepository: TransactionRepository;

  constructor(transactionRepository: TransactionRepository) {
    this.transactionRepository = transactionRepository;
  }

  async getTransaction(transactionId: string): Promise<Transaction | null> {
    return await this.transactionRepository.get(transactionId);
  }
}
