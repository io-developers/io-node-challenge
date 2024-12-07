import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { IActivityRepository } from '../domain/repositories/IActivityRepository'
import { ILogger } from '../../helper/logs/ILogger';
import { ActivityDTO } from '../domain/dto/activity.dto';

export class ActivityRepository implements IActivityRepository {
  private readonly tableName: string;

  private readonly dynamoDbClient: DocumentClient;

  private readonly logger: ILogger;

  constructor(dynamoDbClient: DocumentClient, logger: ILogger) {
    this.tableName = process.env.ACTIVITY_TABLE || '';
    this.dynamoDbClient = dynamoDbClient;
    this.logger = logger;
  }

  async saveActivity(activityDto: ActivityDTO): Promise<void> {
    await this.dynamoDbClient.put( {
        TableName: this.tableName,
        Item: activityDto,
      }).promise();
    this.logger.info(`Activity history saved: ${activityDto.activityId}`);
  }
}