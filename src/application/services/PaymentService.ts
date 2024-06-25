import * as AWS from 'aws-sdk';
import { IPaymentService } from './IPaymentService';
import { IPaymentRepository } from '../../domain/repositories/IPaymentRepository';
import { ITransactionRepository } from '../../domain/repositories/ITransactionRepository';
import { ILogger } from '../../infrastructure/utils/ILogger';
import { Transaction } from '../../domain/models/Transaction';
import { BadRequestError } from '../../infrastructure/errors/BadRequestError';
import { InternalServerError } from '../../infrastructure/errors/DatabaseError';
import { generateId } from '../../infrastructure/utils';

const stepfunctions = new AWS.StepFunctions();

export class PaymentService implements IPaymentService {
  constructor(
    private paymentRepository: IPaymentRepository,
    private transactionRepository: ITransactionRepository,
    private logger: ILogger,
  ) {}

  async processPayment(transaction: Transaction): Promise<Transaction> {
    this.logger.info('Starting processPayment', { transaction });

    await this.paymentRepository.savePayment(transaction);
    await this.transactionRepository.saveTransaction(transaction);

    this.logger.info('Payment processed successfully', {
      transactionId: transaction.transactionId,
    });
    return transaction;
  }

  async startPaymentProcess(
    userId: string,
    amount: number,
  ): Promise<{ message: string; transactionId: string }> {
    if (!userId || !amount) {
      this.logger.error('Validation Error: Missing userId or amount');
      throw new BadRequestError('userId and amount are required');
    }

    const transactionId = generateId();
    const params = {
      stateMachineArn: process.env.STATE_MACHINE_ARN || '',
      input: JSON.stringify({
        userId,
        amount,
        transactionId,
      }),
    };

    try {
      const result = await stepfunctions.startExecution(params).promise();
      this.logger.info('Step Function execution started', result);

      return {
        message: 'Payment registered successfully',
        transactionId,
      };
    } catch (error) {
      this.logger.error('Error starting payment process', { error });
      throw new InternalServerError('Something went wrong');
    }
  }
}
