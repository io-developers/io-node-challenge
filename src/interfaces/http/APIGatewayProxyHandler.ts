import {
  APIGatewayProxyHandler,
  APIGatewayProxyEvent,
  Context,
} from 'aws-lambda';
import { StatusCodes } from 'http-status-codes';
import { AppError } from '../../infrastructure/errors/AppError';
import { logger } from '../../infrastructure/utils/Logger';
import { errorResponse, successResponse } from './responseHandler';

export const apiGatewayHandler =
  (
    handler: (
      event: APIGatewayProxyEvent | any,
      context: Context,
    ) => Promise<any>,
  ): APIGatewayProxyHandler =>
  async (event, context) => {
    try {
      const result = await handler(event, context);
      return successResponse(StatusCodes.OK, result);
    } catch (error) {
      if (error instanceof AppError) {
        logger.error(`Error: ${error.message}`);
        return errorResponse(error.statusCode, error.message);
      }

      const err = error as Error;
      logger.error(`Unexpected error: ${err.message}`);
      return errorResponse(
        StatusCodes.INTERNAL_SERVER_ERROR,
        `Internal Server Error: ${err.message}`,
      );
    }
  };
