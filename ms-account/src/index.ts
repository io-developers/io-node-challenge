import "reflect-metadata";
import { APIGatewayProxyEvent, APIGatewayProxyResult, DynamoDBStreamEvent } from 'aws-lambda';
import { getAccountHandler } from "./infraestructure/handlers/get-account.handler";
import { validateAccountHandler } from "./infraestructure/handlers/validate-account.handler";
import { updateAccountHandler } from "./infraestructure/handlers/update-account.handler";

export const getAccountLambdaHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  return await getAccountHandler(event);
};

export const validateAccountLambdaHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  return await validateAccountHandler(event);
};

export const updateAccountDynamoStreamHandler = async (event: DynamoDBStreamEvent) => {
  await updateAccountHandler(event);
};