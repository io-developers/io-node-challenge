import {DynamoDBAccountRepository} from "../../persistence/DynamoDBAccountRepository";
import {GetAccountDetailsUseCase} from "../../../application/use-cases/GetAccountBalanceUseCase";

import {Logger} from '@aws-lambda-powertools/logger';

const accountRepository = new DynamoDBAccountRepository();
const getAccountDetailsUseCase = new GetAccountDetailsUseCase(accountRepository);
const logger = new Logger();

export const handler = async (event: any) => {
  const accountId = event.pathParameters.accountId;

  logger.info('Received event:', { event });

  try {
    logger.info('Fetching account details for accountId:', accountId);
    const account = await getAccountDetailsUseCase.execute(accountId);

    logger.info('Account details retrieved:', { account });

    return {
      statusCode: 200,
      body: JSON.stringify({
        id: account.id,
        ownerId: account.ownerId,
        balance: account.balance,
        status: account.status,
        createdAt: account.createdAt,
        updatedAt: account.updatedAt
      }),
    };
  } catch (error) {
    logger.error('Error fetching account details:', { error: error.message });
    return {
      statusCode: 404,
      body: JSON.stringify({ message: error.message }),
    };
  }
};
