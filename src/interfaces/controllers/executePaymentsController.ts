import { Context } from 'aws-lambda';
import axios from 'axios';
import { PaymentService } from '../../application/services/PaymentService';
import { PaymentRepository } from '../../domain/repositories/PaymentRepository';
import { TransactionRepository } from '../../domain/repositories/TransactionRepository';
import { Transaction } from '../../domain/models/Transaction';
import dynamoDbClient from '../../infrastructure/database/DynamoDBClient';
import { logger } from '../../infrastructure/utils/Logger';

const paymentRepository = new PaymentRepository(axios, logger);
const transactionRepository = new TransactionRepository(dynamoDbClient, logger);
const paymentService = new PaymentService(
  paymentRepository,
  transactionRepository,
  logger,
);

export const executePayment = async (
  transaction: Transaction,
  context: Context,
) => {
  logger.info('Executing payment', { transaction, context });

  await paymentService.processPayment(transaction);

  logger.info('Payment execution completed', {
    transactionId: transaction.transactionId,
  });

  return transaction.transactionId;
};
