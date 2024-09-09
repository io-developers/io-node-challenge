import { DynamoDB } from 'aws-sdk';

export class AccountService {
  private dynamoDb = new DynamoDB.DocumentClient();
  private accountsTable = process.env.ACCOUNTS_TABLE || '';

  async updateBalance(accountId: string, amount: number) {
    return this.dynamoDb.update({
      TableName: this.accountsTable,
      Key: { id: accountId },
      UpdateExpression: 'set amount = amount + :val',
      ExpressionAttributeValues: {
        ':val': amount,
      },
    }).promise();
  }

  async getAccountById(accountId: string) {
    const params = {
      TableName: this.accountsTable,
      Key: { id: accountId },
    };

    const result = await this.dynamoDb.get(params).promise();

    if (!result.Item) {
      throw new Error('Account not found');
    }

    return result.Item;
  }
}