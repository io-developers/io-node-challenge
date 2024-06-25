import { APIGatewayProxyEvent } from 'aws-lambda';
import { apiGatewayHandler } from '../http/APIGatewayProxyHandler';
import { TransactionService } from '../../application/services/TransactionService';
import { TransactionRepository } from '../../domain/repositories/TransactionRepository';
import { BadRequestError } from '../../infrastructure/errors/BadRequestError';
import dynamoDbClient from '../../infrastructure/database/DynamoDBClient';
import { logger } from '../../infrastructure/utils/Logger';

const transactionRepository = new TransactionRepository(dynamoDbClient, logger);
const transactionService = new TransactionService(
  transactionRepository,
  logger,
);

const getTransaction = async (event: APIGatewayProxyEvent) => {
  logger.info('Received request to get transaction', {
    queryStringParameters: event.queryStringParameters,
  });

  const transactionId = event.queryStringParameters?.transactionId;

  if (!transactionId) {
    logger.error('Transaction ID is required but not provided');
    throw new BadRequestError('Transaction ID is required');
  }

  const transaction = await transactionService.fetchTransaction(transactionId);
  logger.info('Transaction retrieval successful', { transactionId });

  return transaction;
};

export const getTransactionController = apiGatewayHandler(getTransaction);
