import { DynamoDBClient, PutItemCommand, ScanCommand } from "@aws-sdk/client-dynamodb";
import { Activity } from "../domain/Activity";
import { ActivityRepo } from "../domain/ActivityRepo";

export class DynamoActivityRepo extends ActivityRepo {
  constructor (
    private readonly dynamoDb: DynamoDBClient,
    private readonly tableName: string
  ) {
    super();
  }

  async save(activity: Activity): Promise<void> {
    await this.dynamoDb.send(new PutItemCommand({
      TableName: this.tableName,
      Item: {
        activityId: { S: activity.activityId },
        transactionId: { S: activity.transactionId },
        date: { S: activity.date.toISOString() }
      }
    }));
  }

  async findAll(): Promise<Activity[]> {
    const result = await this.dynamoDb.send(new ScanCommand({
      TableName: this.tableName,
    }));

    return result.Items?.map(item => <Activity> {
      activityId: item.activityId.S,
      transactionId: item.transactionId.S,
      date: item.date.S ? new Date(item.date.S) : new Date()
    }) ?? [];
  }
}