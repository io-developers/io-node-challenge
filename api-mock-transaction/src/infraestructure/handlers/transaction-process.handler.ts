import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { TransactionProcessUsecase } from '../../application/usecases/transaction-process.usecase';
import { Logger } from '@aws-lambda-powertools/logger';

const logger = new Logger({ serviceName: 'TransactionProcessHandler' });
const transactionProcessUsecase = new TransactionProcessUsecase();

export const transactionProcessHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const body: {accountId: string, amount: number} = typeof event.body === 'string' ? JSON.parse(event.body) : event.body;
  if (!body.accountId) {
    logger.error('Missing accountId parameter');
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Missing accountId parameter' }),
    };
  }
  const data = await transactionProcessUsecase.execute(body.amount);

  return {
    statusCode: data.status === 'SUCCESS' ? 200 : 400,
    body: JSON.stringify(data),
  };
};