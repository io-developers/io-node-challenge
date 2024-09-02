import { Account } from "../../domain/entities/Account";
import { AccountRepository } from "../../domain/repositories/AccountRepository";
import * as AWS from 'aws-sdk';

const dynamoDb = new AWS.DynamoDB.DocumentClient();

export class DynamoDBAccountRepository implements AccountRepository {
  private tableName = 'accounts';

  async findById(id: string): Promise<Account | null> {
    const result = await dynamoDb.get({
      TableName: this.tableName,
      Key: { id }
    }).promise();

    if (!result.Item) {
      return null;
    }

    const { id: accountId, ownerId, balance, status, createdAt, updatedAt } = result.Item;
    return new Account(accountId, ownerId, balance, status, new Date(createdAt), new Date(updatedAt));
  }
}
