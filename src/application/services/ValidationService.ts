import { IValidationService } from './IValidationService';
import { BadRequestError } from '../../infrastructure/errors/BadRequestError';

export class ValidationService implements IValidationService {
  validatePaymentRequest(body: string | null): {
    transactionId: string;
    userId: string;
    amount: number;
  } {
    if (!body) {
      throw new BadRequestError('Request body is required');
    }

    let parsedBody: { transactionId: string; userId: string; amount: number };

    try {
      parsedBody = JSON.parse(body);
    } catch (error) {
      throw new BadRequestError('Invalid JSON format');
    }

    const { transactionId, userId, amount } = parsedBody;

    if (!transactionId || !userId || !amount) {
      throw new BadRequestError('Invalid payment request');
    }

    return { transactionId, userId, amount };
  }
}
