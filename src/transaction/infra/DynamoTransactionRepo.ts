import { DynamoDBClient, GetItemCommand, PutItemCommand, ScanCommand } from "@aws-sdk/client-dynamodb";
import { TransactionRepository } from "../domain/TransactionRepo";
import { Transaction } from "../domain/Transaction";
import { TransactionNotFound } from "../domain/TransactionNotFound";

export class DynamoTransactionRepo extends TransactionRepository {
  constructor (
    private readonly dynamoDb: DynamoDBClient,
    private readonly tableName: string
  ) {
    super();
  }

  async save(transaction: Transaction) {
    await this.dynamoDb.send(new PutItemCommand({
      TableName: this.tableName,
      Item: {
        transactionId: { S: transaction.transactionId },
        userId: { S: transaction.userId },
        amount: { N: transaction.amount.toString() },
      }
    }));
  }

  async getTransactionById(transactionId: string): Promise<Transaction> {
    const result = await this.dynamoDb.send(new GetItemCommand({
      TableName: this.tableName,
      Key: {
        transactionId: { S: transactionId }
      }
    }));

    if (!result.Item) {
      throw new TransactionNotFound(`Transaction with ID ${transactionId} not found`);
    }

    return <Transaction> {
      transactionId: result.Item.transactionId.S,
      userId: result.Item.userId.S,
      amount: parseFloat(result.Item.amount.N ?? "0"),
      createdAt: result.Item.createdAt.S ? new Date(result.Item.createdAt.S) : new Date(),
      updatedAt: result.Item.updatedAt.S ? new Date(result.Item.updatedAt.S) : new Date(),
    };
  }

  async getTransactions(): Promise<Transaction[]> {
    const result = await this.dynamoDb.send(new ScanCommand({
      TableName: this.tableName,
    }));

    return result.Items?.map(item => <Transaction> {
      transactionId: item.transactionId.S,
      userId: item.userId.S,
      amount: parseFloat(item.amount.N ?? "0"),
      createdAt: item.createdAt.S ? new Date(item.createdAt.S) : new Date(),
      updatedAt: item.updatedAt.S ? new Date(item.updatedAt.S) : new Date(),
    }) ?? [];
  }
}