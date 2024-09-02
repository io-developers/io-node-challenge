import { APIGatewayProxyHandler } from 'aws-lambda';
import { GetTransactionById } from '../../application/getTransactionById';

export const handler: APIGatewayProxyHandler = async (event) => {
  console.info('APIGatewayProxyHandler::Event ', event);
  const transactionId = event.queryStringParameters?.transactionId;

  if (!transactionId) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Transaction ID is required' }),
    };
  }

  const getTransactionById = new GetTransactionById();
  const transaction = await getTransactionById.execute(transactionId);

  if (!transaction) {
    return {
      statusCode: 404,
      body: JSON.stringify({ message: 'Transaction not found' }),
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify(transaction),
  };
};
