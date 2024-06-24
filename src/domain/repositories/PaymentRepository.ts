import { IPaymentRepository } from './IPaymentRepository';
import { logger } from '../../infrastructure/utils';
import { Transaction } from '../models/Transaction';
import axios from 'axios';
import { StatusCodes } from 'http-status-codes';
import { PaymentError } from '../../infrastructure/errors/PaymentError';

export class PaymentRepository implements IPaymentRepository {

  async savePayment(transaction: Transaction): Promise<boolean> {
    try {
      logger.info('Starting savePayment process', { transaction });

      const response = await axios.post(`${process.env.MOCK_API_URL}/v1/mockPayment`, transaction);

      logger.info('Received response from mock payment API', { status: response.status, data: response.data });

      if (response.status === StatusCodes.OK) {
        logger.info('Payment saved successfully', { transactionId: transaction.transactionId });
        return true;
      } else {
        logger.error('Payment service returned a non-200 status code', { status: response.status, data: response.data });
        throw new PaymentError('Payment service returned a non-200 status code');
      }
    } catch (error: unknown) {
      logger.error('Error occurred while saving payment', { error });

      if (error instanceof Error) {
        throw new PaymentError(`Failed to save payment: ${error.message}`);
      } else {
        throw new PaymentError('An unknown error occurred while saving payment');
      }
    }
  }
}
