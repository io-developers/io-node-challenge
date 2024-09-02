import {TransactionRepository} from "../../domain/repositories/TransactionRepository";
import {Transaction} from "../../domain/entities/Transaction";
import * as AWS from 'aws-sdk';

const dynamoDb = new AWS.DynamoDB.DocumentClient();

export class DynamoDBTransactionRepository implements TransactionRepository {
  async save(transaction: Transaction): Promise<void> {
    await dynamoDb.put({
      TableName: 'transactions',
      Item: transaction
    }).promise();
  }

  async update(transaction: Transaction): Promise<void> {
    await dynamoDb.update({
      TableName: 'transactions',
      Key: {id: transaction.id},
      UpdateExpression: "set #status = :status",
      ExpressionAttributeNames: {'#status': 'status'},
      ExpressionAttributeValues: {':status': transaction.status},
    }).promise();
  }

  async findById(id: string): Promise<Transaction | null> {
    const result = await dynamoDb.get({
      TableName: 'transactions',
      Key: {id}
    }).promise();
    return result.Item as Transaction | null;
  }
}
