import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { TransactionProcessUsecase } from '../../application/usecases/transaction-process.usecase';


const transactionProcessUsecase = new TransactionProcessUsecase();

export const transactionProcessHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const body: {accountId: string, amount: number} = typeof event.body === 'string' ? JSON.parse(event.body) : event.body;
  if (!body.accountId) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Missing accountId parameter' }),
    };
  }
  const data = await transactionProcessUsecase.execute(body.amount);

  return {
    statusCode: data.status === 'SUCCESS' ? 200 : 404,
    body: JSON.stringify(data),
  };
};