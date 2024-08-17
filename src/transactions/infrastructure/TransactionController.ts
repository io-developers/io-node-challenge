import { APIGatewayProxyHandler } from 'aws-lambda';
import { DynamoDBTransactionRepository } from './DynamoDBTransactionRepository';
import { TransactionService } from '../domain/TransactionService';
import logger from '../../common/Logger';
import { RetrieveTransactionUseCase } from '../application/RetrieveTransactionUseCase';

const transactionRepository = new DynamoDBTransactionRepository();
const transactionService = new TransactionService(transactionRepository);
const retrieveTransactionUseCase = new RetrieveTransactionUseCase(
  transactionService,
);

export const getTransaction: APIGatewayProxyHandler = async (event) => {
  try {
    const transactionId = event.queryStringParameters?.transactionId ?? '';
    const transaction = await retrieveTransactionUseCase.execute(transactionId);

    if (transaction) {
      logger.error('Transaction event', { transaction });
      return {
        statusCode: 200,
        body: JSON.stringify(transaction),
      };
    } else {
      logger.error(`Transaction not found ${transactionId}`);
      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'Transaction not found' }),
      };
    }
  } catch (error) {
    logger.error('Error retrieving transaction:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal Server Error' }),
    };
  }
};
