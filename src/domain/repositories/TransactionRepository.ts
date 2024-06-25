import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { ITransactionRepository } from './ITransactionRepository';
import { Transaction } from '../models/Transaction';
import { ILogger } from '../../infrastructure/utils/ILogger';
import { NotFoundError } from '../../infrastructure/errors/NotFoundError';

export class TransactionRepository implements ITransactionRepository {
  private readonly tableName: string;

  private readonly dynamoDbClient: DocumentClient;

  private readonly logger: ILogger;

  constructor(dynamoDbClient: DocumentClient, logger: ILogger) {
    this.tableName = process.env.TRANSACTIONS_TABLE || '';
    this.dynamoDbClient = dynamoDbClient;
    this.logger = logger;
  }

  async getTransactionById(transactionId: string): Promise<Transaction> {
    const params = {
      TableName: this.tableName,
      Key: { transactionId },
    };

    const result = await this.dynamoDbClient.get(params).promise();
    if (!result.Item) {
      this.logger.info(`Transaction not found: ${transactionId}`);
      throw new NotFoundError('Transaction not found');
    }
    return result.Item as Transaction;
  }

  async saveTransaction(transaction: Transaction): Promise<void> {
    const params = {
      TableName: this.tableName,
      Item: transaction,
    };

    await this.dynamoDbClient.put(params).promise();
    this.logger.info(`Transaction saved: ${transaction.transactionId}`);
  }
}
