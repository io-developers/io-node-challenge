import { Injectable } from '@nestjs/common';
import {
  DynamoDBClient,
  PutItemCommand,
  GetItemCommand,
} from '@aws-sdk/client-dynamodb';
import { v4 as uuidv4 } from 'uuid';
import { TransactionService } from '@application/service/transaction.service';

@Injectable()
export class TransactionServiceHttp implements TransactionService {
  constructor(private readonly _dynamoDBClient: DynamoDBClient) {}

  async getTransaction(transactionId: string): Promise<any> {
    const params = {
      TableName: 'transactions',
      Key: {
        transactionId: { S: transactionId },
      },
    };

    const command = new GetItemCommand(params);
    const result = await this._dynamoDBClient.send(command);

    if (!result.Item) {
      return null;
    }

    return {
      transactionId: result.Item.transactionId.S,
      userId: result.Item.userId.S,
      paymentAmount: parseInt(result.Item.amount.N, 10),
    };
  }

  async createTransaction(userId: string, amount: number): Promise<string> {
    const transactionId = uuidv4();

    const params = {
      TableName: 'transactions',
      Item: {
        transactionId: { S: transactionId },
        userId: { S: userId },
        amount: { N: amount.toString() },
      },
    };

    const command = new PutItemCommand(params);
    await this._dynamoDBClient.send(command);

    return transactionId;
  }
}
