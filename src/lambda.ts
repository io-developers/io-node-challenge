import type { APIGatewayEvent, APIGatewayProxyResultV2 } from "aws-lambda";

export const mockPaymentHandler = async (_: APIGatewayEvent): Promise<APIGatewayProxyResultV2> => {
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Payment processed successfully'
    })
  };
}

export { registerActivityHandler } from './activity/activity.handler';
export { executePaymentHandler } from './transaction/transaction.handler';
export { getTransactionsHandler } from './transaction/transaction.handler';
export { checkUserHandler } from './user/user.handler';

