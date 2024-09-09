import { DynamoDB } from 'aws-sdk';

export class PaymentService {
  private dynamoDb = new DynamoDB.DocumentClient();
  private tableName = process.env.TRANSACTION_TABLE || '';

  async saveTransaction(transaction: any) {
    return this.dynamoDb.put({
      TableName: this.tableName,
      Item: transaction,
    }).promise();
  }
}