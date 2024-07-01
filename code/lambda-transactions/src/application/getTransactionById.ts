import { DynamoDBTransactionRepository } from '../infrastructure/repository/DynamoDBTransactionRepository';
import { Transaction } from '../domain/entity/Transaction';

export class GetTransactionById {
  private transactionRepository: DynamoDBTransactionRepository;

  constructor() {
    this.transactionRepository = new DynamoDBTransactionRepository();
  }

  async execute(transactionId: string): Promise<Transaction | null> {
    return await this.transactionRepository.getTransactionById(transactionId);
  }
}
