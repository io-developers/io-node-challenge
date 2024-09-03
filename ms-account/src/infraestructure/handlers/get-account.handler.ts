import "reflect-metadata";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { container } from '../containers/inversify.container';
import { TYPES } from "../containers/inversify.constant";
import dotenv from 'dotenv';
import { GetAccountUsecase } from "../../application/usecases/get-account.usecase";
import { Logger } from "@aws-lambda-powertools/logger";
dotenv.config();

const logger = new Logger({ serviceName: 'GetAccountHandler' });

const getAccountUsecase = container.get<GetAccountUsecase>(TYPES.GetAccountUsecase);

export const getAccountHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  logger.info('Initializing getAccountHandler:', { event });
  const accountId = event.pathParameters?.accountId;
  if (!accountId) {
    logger.error('Missing accountId parameter');
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Missing accountId parameter' }),
    };
  }
  const data = await getAccountUsecase.execute(accountId);
  logger.info('getAccountHandler executed successfully:', { data });
  return {
    statusCode: data.status === 'OK' ? 200 : 404,
    body: JSON.stringify(data),
  };
};