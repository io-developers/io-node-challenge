import { DynamoDBActivityRepository } from '../infrastructure/repository/DynamoDBActivityRepository';
import { Transaction } from '../domain/entity/Transaction';

export class SaveActivity {
  private activityRepository: DynamoDBActivityRepository;

  constructor() {
    this.activityRepository = new DynamoDBActivityRepository();
  }

  async execute(transaction: Transaction): Promise<Transaction | null> {
    return await this.activityRepository.saveActivity(transaction);
  }
}
