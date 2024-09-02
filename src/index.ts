import { APIGatewayProxyHandler } from 'aws-lambda';
import { executePayment } from './lambdas/executePayment';
import { getAccount } from './lambdas/getAccount';

// Handler para POST /v1/payments
// @ts-ignore
export const postPayments: APIGatewayProxyHandler = async (event) => {
  // @ts-ignore
  return executePayment(event);
};

// Handler para GET /v1/accounts/{accountId}
// @ts-ignore
export const getAccounts: APIGatewayProxyHandler = async (event) => {
  // @ts-ignore
  return getAccount(event);
};
