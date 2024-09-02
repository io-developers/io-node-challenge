import { APIGatewayProxyHandler } from 'aws-lambda';
import { AccountService } from '../services/accountService';
import { apiResponse } from '../utils/apiResponse';

export const getAccount: APIGatewayProxyHandler = async (event) => {

  if (!event.pathParameters || !event.pathParameters.accountId) {
    return apiResponse(400,
      { message: 'Invalid request: missing accountId in path parameters' },
    );
  }

  const accountId = event.pathParameters.accountId;
  const accountService = new AccountService();

  try {
    const account = await accountService.getAccountById(accountId);
    if (account) {
      return apiResponse(200, account);
    } else {
      return apiResponse(404, { message: 'Account not found' });
    }
  } catch (error) {
    return apiResponse(500, { message: 'Internal Server Error' });
  }
};
