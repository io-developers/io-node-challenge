import { ITransactionRepository } from './ITransactionRepository';
import { Transaction } from '../models/Transaction';
import { logger } from '../../infrastructure/utils';
import dynamoDbClient from '../../infrastructure/database/DynamoDBClient';
import { NotFoundError } from '../../infrastructure/errors/NotFoundError';

export class TransactionRepository implements ITransactionRepository {
  private readonly tableName: string;

  constructor() {
    this.tableName = process.env.TRANSACTIONS_TABLE || '';
  }

  async getTransactionById(transactionId: string): Promise<Transaction | null> {
    const params = {
      TableName: this.tableName,
      Key: { transactionId },
    };

    const result = await dynamoDbClient.get(params).promise();
    if (!result.Item) {
      logger.info(`Transaction not found: ${transactionId}`);
      throw new NotFoundError(`Transaction with ID ${transactionId} not found`);
    }
    return result.Item as Transaction;
  }

  async saveTransaction(transaction: Transaction): Promise<void> {
    const params = {
      TableName: this.tableName,
      Item: transaction,
    };

    await dynamoDbClient.put(params).promise();
    logger.info(`Transaction saved: ${transaction.transactionId}`);
  }
}
