import AWS from 'aws-sdk';
import { Transaction } from '../domain/Transaction';

const dynamoDb = new AWS.DynamoDB.DocumentClient();

export class DynamoDBTransactionRepository {
  async get(transactionId: string): Promise<Transaction | null> {
    const params = {
      TableName: process.env.TRANSACTIONS_TABLE!,
      Key: { transactionId },
    };

    const result = await dynamoDb.get(params).promise();
    if (result.Item) {
      return new Transaction(
        result.Item.transactionId,
        result.Item.userId,
        result.Item.paymentAmount,
      );
    }
    return null;
  }
}
