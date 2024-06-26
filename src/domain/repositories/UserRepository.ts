import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { IUserRepository } from './IUserRepository';
import { User } from '../models/User';
import { ILogger } from '../../infrastructure/utils/ILogger';
import { NotFoundError } from '../../infrastructure/errors/NotFoundError';

export class UserRepository implements IUserRepository {
  private readonly tableName: string;

  private readonly dynamoDbClient: DocumentClient;

  private readonly logger: ILogger;

  constructor(dynamoDbClient: DocumentClient, logger: ILogger) {
    this.tableName = process.env.USERS_TABLE || '';
    this.dynamoDbClient = dynamoDbClient;
    this.logger = logger;
  }

  async getUserById(userId: string): Promise<User | null> {
    const params = {
      TableName: this.tableName,
      Key: { userId },
    };

    const result = await this.dynamoDbClient.get(params).promise();
    if (!result.Item) {
      this.logger.info(`User not found: ${userId}`);
      throw new NotFoundError(`User with ID ${userId} not found`);
    }
    return result.Item as User;
  }

  async createUser(user: User): Promise<void> {
    const params = {
      TableName: this.tableName,
      Item: user,
    };

    await this.dynamoDbClient.put(params).promise();
    this.logger.info(`User created: ${user.userId}`);
  }
}
