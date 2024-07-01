import { APIGatewayProxyHandler } from 'aws-lambda';
import { CreatePayment } from '../../../src/application/createPayment';
import { Util } from '../../../src/util/util';

export const handler: APIGatewayProxyHandler = async (event) => {

  console.info("APIGatewayProxyHandler Event :",event)
  const createPayment = new CreatePayment();

  const transactionRequest =  Util.convertTextToTransaction(JSON.stringify(event));

  if (transactionRequest == null ) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Invalid payment request' }),
    };

  }

  const transaction = await createPayment.execute(transactionRequest);

  console.info("APIGatewayProxyHandler transaction :",transaction)

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
