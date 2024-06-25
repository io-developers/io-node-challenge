import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { IActivityRepository } from './IActivityRepository';
import { Activity } from '../models/Activity';
import { ILogger } from '../../infrastructure/utils/ILogger';

export class ActivityRepository implements IActivityRepository {
  private readonly tableName: string;

  private readonly dynamoDbClient: DocumentClient;

  private readonly logger: ILogger;

  constructor(dynamoDbClient: DocumentClient, logger: ILogger) {
    this.tableName = process.env.ACTIVITY_TABLE || '';
    this.dynamoDbClient = dynamoDbClient;
    this.logger = logger;
  }

  async saveActivity(activity: Activity): Promise<void> {
    const params = {
      TableName: this.tableName,
      Item: activity,
    };

    await this.dynamoDbClient.put(params).promise();
    this.logger.info(`Activity saved: ${activity.activityId}`);
  }
}
