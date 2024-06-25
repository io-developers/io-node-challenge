import { ITransactionService } from './ITransactionService';
import { Transaction } from '../../domain/models/Transaction';
import { ITransactionRepository } from '../../domain/repositories/ITransactionRepository';
import { ILogger } from '../../infrastructure/utils/ILogger';

export class TransactionService implements ITransactionService {
  constructor(
    private transactionRepository: ITransactionRepository,
    private logger: ILogger,
  ) {}

  async fetchTransaction(transactionId: string): Promise<Transaction> {
    this.logger.info('Fetching transaction', { transactionId });
    const transaction =
      await this.transactionRepository.getTransactionById(transactionId);
    this.logger.info('Transaction fetched successfully', { transactionId });
    return transaction;
  }

  async processTransaction(transaction: Transaction): Promise<void> {
    this.logger.info('Processing transaction', {
      transactionId: transaction.transactionId,
    });
    await this.transactionRepository.saveTransaction(transaction);
    this.logger.info('Transaction processed successfully', {
      transactionId: transaction.transactionId,
    });
  }
}
