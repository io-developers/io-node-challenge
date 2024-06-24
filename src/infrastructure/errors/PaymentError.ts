import { StatusCodes } from 'http-status-codes';
import { AppError } from './AppError';

export class PaymentError extends AppError {
  constructor(message: string) {
    super(message, StatusCodes.BAD_REQUEST); // O usa el código de estado que prefieras
  }
}
