import { Transaction } from "../../domain/entities/transaction.entity";
import { v4 as uuidv4 } from 'uuid';
import { Logger } from '../../infrastructure/logging/Logger';
import {APIGatewayProxyEvent, APIGatewayProxyResult} from "aws-lambda";

export const executePayment = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

  const body = JSON.parse(event.body || '{}');

  const userId = body.userId;
  if (!userId) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Missing required field: userId' })
    };
  }

  const transactionMock: Transaction = {
    userId: userId,
    transactionId: uuidv4(),
    status: 'success'
  };

  return {
    statusCode: 200,
    body: JSON.stringify(transactionMock)
  };
};
