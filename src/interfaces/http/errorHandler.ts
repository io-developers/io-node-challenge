import { StatusCodes } from 'http-status-codes';
import { AppError } from '../../infrastructure/errors/AppError';
import { logger } from '../../infrastructure/utils';
import { errorResponse } from './responseHandler';

export const handleError = (error: Error) => {
  if (error instanceof AppError) {
    logger.error(`Error: ${error.message}`);
    return errorResponse(error.statusCode, error.message);
  }

  logger.error(`Unexpected error: ${error.message}`);
  return errorResponse(StatusCodes.INTERNAL_SERVER_ERROR, 'Internal Server Error');
};
