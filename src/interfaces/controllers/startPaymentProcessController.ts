import { APIGatewayProxyEvent } from 'aws-lambda';
import axios from 'axios';
import { apiGatewayHandler } from '../http/APIGatewayProxyHandler';
import { PaymentService } from '../../application/services/PaymentService';
import { PaymentRepository } from '../../domain/repositories/PaymentRepository';
import { TransactionRepository } from '../../domain/repositories/TransactionRepository';
import dynamoDbClient from '../../infrastructure/database/DynamoDBClient';
import { logger } from '../../infrastructure/utils/Logger';

const paymentRepository = new PaymentRepository(axios, logger);
const transactionRepository = new TransactionRepository(dynamoDbClient, logger);
const paymentService = new PaymentService(
  paymentRepository,
  transactionRepository,
  logger,
);

const startPaymentProcess = async (event: APIGatewayProxyEvent) => {
  logger.info('Received start payment process request', { event });

  const body = JSON.parse(event.body || '{}');
  const { userId, amount } = body;

  return await paymentService.startPaymentProcess(userId, amount);
};

export const startPaymentProcessController =
  apiGatewayHandler(startPaymentProcess);
