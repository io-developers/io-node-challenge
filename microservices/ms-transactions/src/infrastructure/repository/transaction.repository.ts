import { DocumentClient } from "aws-sdk/clients/dynamodb";
import { ITransactionRepository } from "../../domain/use-cases/transaction.repository";
import { Transaction } from "../../domain/entities/transaction.entity";
import { ILogger } from "../../domain/interfaces/ILogger";

export class DynamoDBTransactionRepository implements ITransactionRepository {

  private readonly documentClient: DocumentClient;
  private readonly table: string;
  private readonly logger: ILogger;

  constructor(documentClient: DocumentClient, logger: ILogger) {
    this.documentClient = documentClient;
    this.table = process.env.TRANSACTIONS_TABLE || 'transactions';
    this.logger = logger;
  }

  async findById(transactionId: string): Promise<Transaction | null> {

    const result = await this.documentClient.get({
      TableName: this.table,
      Key: { transactionId }
    }).promise();

    this.logger.info(`[DynamoDBTransactionRepository][Table: ${this.table}] get Transaction ${JSON.stringify(result)}.`);

    if (result === null || result.Item === undefined) {
      this.logger.info(`[DynamoDBTransactionRepository][Table: ${this.table}] Transaction ${transactionId} not found.`);
      return null;
    }

    return result.Item as Transaction | null;
  }
}
