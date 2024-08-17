import { Transaction } from '../domain/Transaction';
import { TransactionService } from '../domain/TransactionService';

export class RetrieveTransactionUseCase {
  private transactionService: TransactionService;

  constructor(transactionService: TransactionService) {
    this.transactionService = transactionService;
  }

  async execute(transactionId: string): Promise<Transaction | null> {
    const transaction =
      await this.transactionService.getTransaction(transactionId);
    return transaction;
  }
}
