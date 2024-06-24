import { apiGatewayHandler } from '../http/APIGatewayProxyHandler';
import { APIGatewayProxyEvent, Context } from 'aws-lambda';
import { UserService } from '../../application/services/UserService';
import { UserRepository } from '../../domain/repositories/UserRepository';
import { successResponse, errorResponse } from '../http/responseHandler';
import { StatusCodes } from 'http-status-codes';
import { Transaction } from '../../domain/models/Transaction';

const userRepository = new UserRepository();
const userService = new UserService(userRepository);

export const validateUser = async (transaction: Transaction, context: Context) => {
  const userId = transaction.userId;

  if (!userId) {
    return errorResponse(StatusCodes.BAD_REQUEST, 'User ID is required');
  }

  const user = await userService.validateUser(userId);
  if (user) {
    return transaction;
  } else {
    return errorResponse(StatusCodes.NOT_FOUND, 'User not found');
  }
};

