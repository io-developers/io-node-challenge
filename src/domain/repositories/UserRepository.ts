import { IUserRepository } from './IUserRepository';
import { User } from '../models/User';
import { logger } from '../../infrastructure/utils';
import dynamoDbClient from '../../infrastructure/database/DynamoDBClient';
import { NotFoundError } from '../../infrastructure/errors/NotFoundError';

export class UserRepository implements IUserRepository {
  private readonly tableName: string;

  constructor() {
    this.tableName = process.env.USERS_TABLE || '';
  }

  async getUserById(userId: string): Promise<User | null> {
    const params = {
      TableName: this.tableName,
      Key: { userId },
    };

    const result = await dynamoDbClient.get(params).promise();
    if (!result.Item) {
      logger.info(`User not found: ${userId}`);
      throw new NotFoundError(`User with ID ${userId} not found`);
    }
    return result.Item as User;
  }

  async createUser(user: User): Promise<void> {
    const params = {
      TableName: this.tableName,
      Item: user,
    };

    await dynamoDbClient.put(params).promise();
    logger.info(`User created: ${user.userId}`);
  }
}
