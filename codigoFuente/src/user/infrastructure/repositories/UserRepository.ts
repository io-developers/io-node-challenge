import { DocumentClient } from "aws-sdk/clients/dynamodb";
import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { ILogger } from "../../../helper/logs/ILogger";

export class UserRepository implements IUserRepository {
  private readonly tableName: string;
  private readonly dynamoDbClient: DocumentClient;
  private readonly logger: ILogger;

  constructor(dynamoDbClient: DocumentClient, logger: ILogger) {
    this.tableName = process.env.USER_TABLE || '';
    this.dynamoDbClient = dynamoDbClient;
    this.logger = logger;
  }

  async getUserById(userId: string): Promise<boolean | null> {
    const result = await this.dynamoDbClient
      .get({
        TableName: this.tableName,
        Key: { userId: userId },
      })
      .promise();

    if (!result.Item) {
      this.logger.info(`UserId not found: `, userId);
      return false;
    } else {
      this.logger.info(`UserId found: `, userId);
    }
    return true;
  }
}
