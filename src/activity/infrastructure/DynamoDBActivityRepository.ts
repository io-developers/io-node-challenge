import { DynamoDB } from 'aws-sdk';
import { ActivityRepository } from '../domain/ActivityRepository';
import { Activity } from '../domain/Activity';

export class DynamoDBActivityRepository implements ActivityRepository {
  private readonly dynamoDb: DynamoDB.DocumentClient;
  private readonly tableName: string;

  constructor() {
    this.dynamoDb = new DynamoDB.DocumentClient();
    this.tableName = process.env.ACTIVITIES_TABLE!;
  }

  async save(activity: Activity): Promise<void> {
    const params = {
      TableName: this.tableName,
      Item: {
        activityId: activity.activityId,
        transactionId: activity.transactionId,
        date: activity.date,
      },
    };

    await this.dynamoDb.put(params).promise();
  }
}
