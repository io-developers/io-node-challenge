import { APIGatewayProxyEvent } from 'aws-lambda';
import { apiGatewayHandler } from '../http/APIGatewayProxyHandler';
import { ValidationService } from '../../application/services/ValidationService';
import { logger } from '../../infrastructure/utils/Logger';

const validationService = new ValidationService();

const processPayment = async (event: APIGatewayProxyEvent) => {
  logger.info('Processing payment request', { event });

  const result = validationService.validatePaymentRequest(event.body);

  logger.info('Payment processed successfully', { result });

  return result;
};

export const mockPaymentController = apiGatewayHandler(processPayment);
