import { APIGatewayProxyHandler } from 'aws-lambda';
import { PaymentService } from '../services/paymentService';
import { apiResponse } from '../utils/apiResponse';

export const executePayment: APIGatewayProxyHandler = async (event) => {

  if (!event.body) {
    return apiResponse(400, { message: 'Request body is missing' });
  }

  try {

    const { accountId, amount } = JSON.parse(event.body);

    if (!accountId || !amount) {
      return apiResponse(400, { message: 'Invalid request: missing accountId or amount' });
    }

    const paymentService = new PaymentService();

    try {
      const transactionId = await paymentService.processPayment({ accountId, amount });
      return apiResponse(201, {
        message: 'Payment registered successfully',
        transactionId,
      });
    } catch (error) {
      return apiResponse(400, { message: 'Something was wrong' });
    }

  } catch (error) {
    return apiResponse(400, { message: 'Something was wrong' });
  }
};
