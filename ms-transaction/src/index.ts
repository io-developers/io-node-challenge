import "reflect-metadata";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { createTransactionHandler } from "./infraestructure/handlers/create-transaction.handler";


export const createTransactionLambdaHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  return await createTransactionHandler(event);
};