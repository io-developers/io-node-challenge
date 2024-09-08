import "reflect-metadata";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { container } from '../containers/inversify.container';
import { ValidateAccountUsecase } from '../../application/usecases/validate-account.usecase';
import { TYPES } from "../containers/inversify.constant";
import dotenv from 'dotenv';
import { Logger } from "@aws-lambda-powertools/logger";
dotenv.config();

const logger = new Logger({ serviceName: 'ValidateAccountHandler' });

const validateAccountUsecase = container.get<ValidateAccountUsecase>(TYPES.ValidateAccountUsecase);

export const validateAccountHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  logger.info('Initializing validateAccountHandler:', { event });
  const accountId = event.pathParameters?.accountId;
  if (!accountId) {
    logger.error('Missing accountId parameter');
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Missing accountId parameter' }),
    };
  }
  const data = await validateAccountUsecase.execute(accountId);
  logger.info('validateAccountHandler executed successfully:', { data });
  return {
    statusCode: data.status === 'OK' ? 200 : 400,
    body: JSON.stringify(data),
  };
};