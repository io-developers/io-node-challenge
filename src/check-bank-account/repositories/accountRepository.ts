import { DynamoDB } from 'aws-sdk';
import { Account } from '../models/account';

export class AccountRepository {
  private dynamoDb: DynamoDB.DocumentClient;
  private tableName: string;

  constructor(dynamoDb: DynamoDB.DocumentClient, tableName: string) {
    this.dynamoDb = dynamoDb;
    this.tableName = tableName;
  }

  async checkAccount(accountId: string): Promise<Account | null> {
    console.info("Tablename:" + this.tableName);
    console.info("repositories accoundId:" + accountId);
    const params = {
      TableName: this.tableName,
      Key: { accountId },
    };

    const result = await this.dynamoDb.get(params).promise();
    return result.Item as Account | null;
  }
}
