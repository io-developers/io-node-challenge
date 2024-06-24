import { IActivityService } from './IActivityService';
import { Activity } from '../../domain/models/Activity';
import { IActivityRepository } from '../../domain/repositories/IActivityRepository';
import { generateId } from '../../infrastructure/utils';

export class ActivityService implements IActivityService {
  constructor(private activityRepository: IActivityRepository) {}

  async recordActivity(transactionId: string): Promise<void> {
    const activity: Activity = {
      activityId: generateId(),
      transactionId,
      date: new Date().toISOString(),
    };

    await this.activityRepository.saveActivity(activity);
  }
}
