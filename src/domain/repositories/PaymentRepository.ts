import { AxiosInstance } from 'axios';
import { StatusCodes } from 'http-status-codes';
import { IPaymentRepository } from './IPaymentRepository';
import { ILogger } from '../../infrastructure/utils/ILogger';
import { Transaction } from '../models/Transaction';
import { BadRequestError } from '../../infrastructure/errors/BadRequestError';

export class PaymentRepository implements IPaymentRepository {
  private httpClient: AxiosInstance;

  private logger: ILogger;

  constructor(httpClient: AxiosInstance, logger: ILogger) {
    this.httpClient = httpClient;
    this.logger = logger;
  }

  async savePayment(transaction: Transaction): Promise<boolean> {
    this.logger.info('Starting savePayment process', { transaction });

    const response = await this.httpClient.post(
      `${process.env.MOCK_API_URL}/v1/mockPayment`,
      transaction,
    );
    this.logger.info('Received response from mock payment API', {
      status: response.status,
      data: response.data,
    });

    if (response.status === StatusCodes.OK) {
      this.logger.info('Payment saved successfully', {
        transactionId: transaction.transactionId,
      });
      return true;
    }
    this.logger.error('Payment service returned a non-200 status code', {
      status: response.status,
      data: response.data,
    });
    throw new BadRequestError('Payment service returned a non-200 status code');
  }
}
