import { APIGatewayEvent, APIGatewayProxyHandler } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';
import { AccountRepository } from './repositories/accountRepository';
import { AccountService } from './services/accountService';
import { CheckAccountUseCase } from './useCases/checkAccountUseCase';
import * as dotenv from 'dotenv';
dotenv.config();

const dynamoDb = new DynamoDB.DocumentClient();
const accountRepository = new AccountRepository(dynamoDb, process.env.TABLE_NAME!);
const accountService = new AccountService(accountRepository);
const checkAccountStatusUseCase = new CheckAccountUseCase(accountService);

export const handler = async (event) => {
  var accountId = event.queryStringParameters && event.queryStringParameters.accountId;
  console.info("request accountId:" + accountId);
  if (!accountId) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'AccountId is required' }),
    };
  }

  const account = await checkAccountStatusUseCase.execute(accountId);

  if (account) {
    return {
      statusCode: 200,
      body: JSON.stringify(account),
    };
  } else {
    return {
      statusCode: 404,
      body: JSON.stringify({ message: 'Account not found' }),
    };
  }
};

