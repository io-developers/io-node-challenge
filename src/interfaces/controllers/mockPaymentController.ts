import { apiGatewayHandler } from '../http/APIGatewayProxyHandler';
import { APIGatewayProxyEvent, Context } from 'aws-lambda';
import { successResponse, errorResponse } from '../http/responseHandler';
import { StatusCodes } from 'http-status-codes';

const processPayment = async (event: APIGatewayProxyEvent, context: Context) => {
  if (!event.body) {
    return errorResponse(StatusCodes.BAD_REQUEST, 'Request body is required');
  }

  let parsedBody: { transactionId: string, userId: string, amount: number };

  try {
    parsedBody = JSON.parse(event.body);
  } catch (error) {
    return errorResponse(StatusCodes.BAD_REQUEST, 'Invalid JSON format');
  }

  const { transactionId, userId, amount } = parsedBody;

  if (!transactionId || !userId || !amount) {
    return errorResponse(StatusCodes.BAD_REQUEST, 'Invalid payment request');
  }

  return successResponse(StatusCodes.OK, { transactionId, userId, amount });
};

export const mockPaymentController = apiGatewayHandler(processPayment);
