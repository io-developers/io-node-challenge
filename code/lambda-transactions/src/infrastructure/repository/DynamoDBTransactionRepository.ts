import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand } from "@aws-sdk/lib-dynamodb";
import { Transaction } from '../../domain/entity/Transaction';
import { ITransactionRepository } from "../../domain/repository/ITransactionRepository";

export class DynamoDBTransactionRepository implements ITransactionRepository{
  private readonly tableName = 'transactions';

  private readonly dbClient = DynamoDBDocumentClient.from(new DynamoDBClient({ region: "us-east-2" }));

  async getTransactionById(transactionId: string): Promise<Transaction | null> {

    const command = new GetCommand({
      TableName: this.tableName,
      Key: { transactionId },
    });

    const result = await this.dbClient.send(command);
    if (!result.Item) {
      return null;
    }

    const { transactionId: id, userId, paymentAmount } = result.Item;
    return new Transaction(id, userId, paymentAmount);
  }
}
