import AWS from 'aws-sdk';
import { Payment } from '../domain/Payment';

const dynamoDb = new AWS.DynamoDB.DocumentClient();

export class DynamoDBPaymentRepository {
  async save(payment: Payment): Promise<void> {
    const params = {
      TableName: process.env.TRANSACTIONS_TABLE!,
      Item: {
        transactionId: payment.transactionId,
        userId: payment.userId,
        amount: payment.amount,
      },
    };

    await dynamoDb.put(params).promise();
  }
  async get(transactionId: string): Promise<Payment | null> {
    const params = {
      TableName: process.env.TRANSACTIONS_TABLE!,
      Key: { transactionId },
    };

    const result = await dynamoDb.get(params).promise();
    if (result.Item) {
      return new Payment(result.Item.userId, result.Item.amount);
    }
    return null;
  }
}
