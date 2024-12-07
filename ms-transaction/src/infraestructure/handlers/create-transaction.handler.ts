import "reflect-metadata";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { container } from '../containers/inversify.container';
import { TYPES } from "../containers/inversify.constant";
import dotenv from 'dotenv';
import { CreateTransactionUsecase } from "../../application/usecases/create-transaction.usecase";
import { CreateTransactionReqDto } from "../../application/dtos/request/create-transaction.req.dto";
import { validate, ValidationError } from "class-validator";
import { Logger } from "@aws-lambda-powertools/logger";
import { CreatedTransactionResDto } from "../../application/dtos/response/created-transaction.res.dto";
dotenv.config();

const logger = new Logger({ serviceName: 'CreateTransactionHandler' });

const createTransactionUseCase = container.get<CreateTransactionUsecase>(TYPES.CreateTransactionUsecase);

export const createTransactionHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  logger.info('Initializing createTransactionHandler:', { event });
  const body = typeof event.body === 'string' ? JSON.parse(event.body): event.body;
  const dto = new CreateTransactionReqDto(body);
  try {
    const errors: ValidationError[] = await validate(dto);
    if (errors.length > 0) {
      logger.error(`Validation errors: ${JSON.stringify(errors.map(e => e.constraints))}`);
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Invalid request', errors: errors.map(e => e.constraints) }),
      };
    }

    const data = await createTransactionUseCase.execute(dto);
    logger.info('createTransactionHandler executed successfully:', { data });
    return {
      statusCode: data.transactionId ? 201 : 400,
      body: JSON.stringify(data),
    };
  } catch (error) {
    logger.error(`Error processing request: ${error}`);
    return {
      statusCode: 400,
      body: JSON.stringify(new CreatedTransactionResDto({})),
    };
  }

};