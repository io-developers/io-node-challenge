import AWS from 'aws-sdk';

import { User } from '../domain/User';
const dynamoDb = new AWS.DynamoDB.DocumentClient();

export class DynamoDBUserRepository {
  async get(userId: string): Promise<User | null> {
    const params = {
      TableName: process.env.USERS_TABLE!,
      Key: { userId },
    };

    const result = await dynamoDb.get(params).promise();
    if (result.Item) {
      return new User(
        result.Item.userId,
        result.Item.name,
        result.Item.lastName,
      );
    }
    return null;
  }
}
