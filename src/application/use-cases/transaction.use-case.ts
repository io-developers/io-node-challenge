import {
  Transaction,
  TransactionRepository,
} from "../../infrastructure/Repository/TransactionRepository";

export interface TransactionUseCase {
  createTransaction(transaction: Transaction): Promise<any>;
  getTransaction(transactionId: string): Promise<any>;
}

export class TransactionUseCase implements TransactionUseCase {
  private transactionService: TransactionRepository;

  constructor(transactionService: TransactionRepository) {
    this.transactionService = transactionService;
  }

  async createTransaction(transaction: Transaction): Promise<any> {
    return await this.transactionService.insertTransaction(transaction);
  }

  async getTransaction(transactionId: string): Promise<Transaction | null> {
    return await this.transactionService.getTransaction(transactionId);
  }
}
