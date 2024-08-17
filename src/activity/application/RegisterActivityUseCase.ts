import { ActivityRepository } from '../domain/ActivityRepository';
import { Activity } from '../domain/Activity';
import { v4 as uuidv4 } from 'uuid';

export class RegisterActivityUseCase {
  constructor(private readonly activityRepository: ActivityRepository) {}

  async execute(transactionId: string): Promise<void> {
    const activity = new Activity(
      uuidv4(),
      transactionId,
      new Date().toISOString(),
    );
    await this.activityRepository.save(activity);
  }
}
