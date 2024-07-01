import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { Transaction } from '../../domain/entity/Transaction';
import { IActivityRepository } from "../../domain/repository/IActivityRepository";

export class DynamoDBActivityRepository implements IActivityRepository{
  private readonly tableName = 'activity';

  private readonly dbClient = DynamoDBDocumentClient.from(new DynamoDBClient({ region: "us-east-2" }));

  async saveActivity(transaction: Transaction): Promise<Transaction | null> {

    const command = new PutCommand({
      TableName: this.tableName,
      Item: {
        transactionId: transaction.transactionId,
        userId: transaction.userId,
        paymentAmount: transaction.paymentAmount,
      },
    });

    await this.dbClient.send(command);

    return transaction;
  }
}
