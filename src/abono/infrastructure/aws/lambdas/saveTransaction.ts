import { DynamoDB } from 'aws-sdk';
import {Logger} from '@aws-lambda-powertools/logger';

const dynamoDb = new DynamoDB.DocumentClient();
const TRANSACTIONS_TABLE = process.env.TRANSACTIONS_TABLE!;
const logger = new Logger();

export const handler = async (event: any) => {
  const { id, accountId, amount, type, status, createdAt } = event;

  logger.info('Received event:', { event });

  try {
    // Guardar la transacción en la tabla de DynamoDB
    await dynamoDb.put({
      TableName: TRANSACTIONS_TABLE,
      Item: { id, accountId, amount, type, status, createdAt },
    }).promise();

    logger.info('Transaction saved successfully', { id });

    return {
      statusCode: 200,
      body: JSON.stringify({ source: id }),
    };
  } catch (error) {
    logger.error('Error saving transaction', { error: error.message });
    throw error;
  }
};
