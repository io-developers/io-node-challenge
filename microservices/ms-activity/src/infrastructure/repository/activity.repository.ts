import { DocumentClient } from "aws-sdk/clients/dynamodb";
import { IActivityRepository } from "../../domain/use-cases/activity.repository";
import { ILogger } from "../../domain/interfaces/ILogger";
import { Activity } from "../../domain/entities/activity.entity";

export class DynamoDBActivityRepository implements IActivityRepository {

  private readonly documentClient: DocumentClient;
  private readonly table: string;
  private readonly logger: ILogger;

  constructor(documentClient: DocumentClient, logger: ILogger) {
    this.documentClient = documentClient;
    this.table = process.env.ACTIVITY_TABLE || 'activity';
    this.logger = logger;
  }

  async add(activity: Activity): Promise<void> {

    await this.documentClient.put({
      TableName: this.table,
      Item: activity
    }).promise();

    this.logger.info(`[DynamoDBActivityRepository][Table: ${this.table}] put Transaction ${JSON.stringify(activity)}.`);

  }
}