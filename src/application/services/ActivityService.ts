import { IActivityService } from './IActivityService';
import { Activity } from '../../domain/models/Activity';
import { IActivityRepository } from '../../domain/repositories/IActivityRepository';
import { ILogger } from '../../infrastructure/utils/ILogger';
import { generateId } from '../../infrastructure/utils';

export class ActivityService implements IActivityService {
  constructor(
    private activityRepository: IActivityRepository,
    private logger: ILogger,
  ) {}

  async recordActivity(transactionId: string): Promise<void> {
    this.logger.info('Recording activity', { transactionId });

    const activity: Activity = {
      activityId: generateId(),
      transactionId,
      date: new Date().toISOString(),
    };

    await this.activityRepository.saveActivity(activity);

    this.logger.info('Activity recorded successfully', { transactionId });
  }
}
