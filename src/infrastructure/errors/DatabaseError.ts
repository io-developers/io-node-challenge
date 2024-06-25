import { StatusCodes } from 'http-status-codes';
import { AppError } from './AppError';

export class InternalServerError extends AppError {
  constructor(message: string) {
    super(message, StatusCodes.INTERNAL_SERVER_ERROR);
  }
}
