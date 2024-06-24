import { apiGatewayHandler } from '../http/APIGatewayProxyHandler';
import { APIGatewayProxyEvent, Context } from 'aws-lambda';
import * as AWS from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';
import { errorResponse, successResponse } from '../http/responseHandler';
import { AppError } from '../../infrastructure/errors/AppError';
import { StatusCodes } from 'http-status-codes';
import { logger } from '../../infrastructure/utils';

const stepfunctions = new AWS.StepFunctions();

const startPaymentProcess = async (event: APIGatewayProxyEvent, context: Context) => {
  try {
    const body = JSON.parse(event.body || '{}');
    const { userId, amount } = body;

    if (!userId || !amount) {
      logger.error('Validation Error: Missing userId or amount');
      return errorResponse(StatusCodes.BAD_REQUEST, 'userId and amount are required');
    }
    const transactionId = uuidv4();
    const params = {
      stateMachineArn: process.env.STATE_MACHINE_ARN || '',
      input: JSON.stringify({
        userId,
        amount,
        transactionId,
      }),
    };

    const result = await stepfunctions.startExecution(params).promise();

    logger.info('Step Function execution started', result);

    return successResponse(StatusCodes.OK, {
      message: 'Payment registered successfully',
      transactionId,
    });
  } catch (error) {
    logger.error('Error starting payment process', error);
    if (error instanceof AppError) {
      return errorResponse(error.statusCode, 'Something was wrong: '+error.message);
    }
    return errorResponse(StatusCodes.INTERNAL_SERVER_ERROR, 'Something was wrong');
  }
};

export const startPaymentProcessController = apiGatewayHandler(startPaymentProcess);
