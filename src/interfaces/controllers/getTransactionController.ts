import { apiGatewayHandler } from '../http/APIGatewayProxyHandler';
import { APIGatewayProxyEvent, Context } from 'aws-lambda';
import { TransactionService } from '../../application/services/TransactionService';
import { TransactionRepository } from '../../domain/repositories/TransactionRepository';
import { successResponse, errorResponse } from '../http/responseHandler';
import { StatusCodes } from 'http-status-codes';

const transactionRepository = new TransactionRepository();
const transactionService = new TransactionService(transactionRepository);

const getTransaction = async (event: APIGatewayProxyEvent, context: Context) => {
  const transactionId = event.queryStringParameters?.transactionId;

  if (!transactionId) {
    return errorResponse(StatusCodes.BAD_REQUEST, 'Transaction ID is required');
  }

  const transaction = await transactionService.fetchTransaction(transactionId);
  if (transaction) {
    return successResponse(StatusCodes.OK, transaction);
  } else {
    return errorResponse(StatusCodes.NOT_FOUND, 'Transaction not found');
  }
};

export const getTransactionController = apiGatewayHandler(getTransaction);
