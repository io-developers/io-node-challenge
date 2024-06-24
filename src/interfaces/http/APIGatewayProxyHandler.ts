import { APIGatewayProxyHandler, APIGatewayProxyEvent, Context } from 'aws-lambda';
import { StatusCodes } from 'http-status-codes';
import { AppError } from '../../infrastructure/errors/AppError';
import { logger } from '../../infrastructure/utils';

export const apiGatewayHandler = (
  handler: (event: APIGatewayProxyEvent, context: Context) => Promise<any>
): APIGatewayProxyHandler => {
  return async (event, context) => {
    try {
      return await handler(event, context);
    } catch (error) {
      if (error instanceof AppError) {
        logger.error(`Error: ${error.message}`);
        throw error; // Lanza el error de vuelta para que la Step Function lo capture
      }

      const err = error as Error;
      logger.error(`Unexpected error: ${err.message}`);
      throw new AppError(`Internal Server Error: ${err.message}` ,StatusCodes.INTERNAL_SERVER_ERROR);
    }
  };
};
