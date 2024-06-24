import { IActivityRepository } from './IActivityRepository';
import { Activity } from '../models/Activity';
import { logger } from '../../infrastructure/utils';
import dynamoDbClient from '../../infrastructure/database/DynamoDBClient';

export class ActivityRepository implements IActivityRepository {
  private readonly tableName: string;

  constructor() {
    this.tableName = process.env.ACTIVITY_TABLE || '';
  }

  async saveActivity(activity: Activity): Promise<void> {
    const params = {
      TableName: this.tableName,
      Item: activity,
    };

    await dynamoDbClient.put(params).promise();
    logger.info(`Activity saved: ${activity.activityId}`);
  }
}
