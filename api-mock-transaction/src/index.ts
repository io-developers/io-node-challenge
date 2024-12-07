import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { transactionProcessHandler } from "./infraestructure/handlers/transaction-process.handler";


export const transactionProcessLambdaHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  return await transactionProcessHandler(event);
};