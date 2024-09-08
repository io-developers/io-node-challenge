import "reflect-metadata";
import { DynamoDBStreamEvent } from 'aws-lambda';
import { container } from '../containers/inversify.container';
import { TYPES } from "../containers/inversify.constant";
import dotenv from 'dotenv';
import { UpdateAccountUsecase } from "../../application/usecases/update-account.usecase";
import { UpdatedAccountReqDto } from "../../application/dtos/request/update-account.req.dto";
import { validate, ValidationError } from "class-validator";
import { AttributeValue } from "aws-sdk/clients/dynamodbstreams";
import { Logger } from "@aws-lambda-powertools/logger";

dotenv.config();

const logger = new Logger({ serviceName: 'UpdateAccountHandler' });

const updateAccountUseCase = container.get<UpdateAccountUsecase>(TYPES.UpdateAccountUsecase);

export const updateAccountHandler = async (event: DynamoDBStreamEvent) => {
  logger.info('Initializing updateAccountHandler:', { event });
  for (const record of event.Records) {
    if (record.eventName === 'INSERT') {
      const newImage = record.dynamodb?.NewImage || undefined;
      const transactionData = newImage?.['data']?.['M'] as { accountId: AttributeValue, amount: AttributeValue } || undefined;
      if (!transactionData) {
        logger.error(`Invalid record: ${record}`);
        continue; // Skip this record and move to the next
      }
      const accountId = transactionData.accountId.S || undefined;
      const amount = parseFloat(transactionData.amount.N || '0');

      const dto = new UpdatedAccountReqDto({ accountId, amount });
      try {
        const errors: ValidationError[] = await validate(dto);
        if (errors.length > 0) {
          logger.error(`Validation errors: ${JSON.stringify(errors.map(e => e.constraints))}`);
          continue; // Skip this record and move to the next
        }

        const data = await updateAccountUseCase.execute(dto.accountId as string, dto.amount as number);
        if (data.status !== 'OK') {
          logger.error(`Failed to update account: ${JSON.stringify(data)}`);
        } else {
          logger.info('updateAccountHandler executed successfully:', { data });
        }

      } catch (error) {
        logger.error(`Error processing record: ${JSON.stringify(error)}`);
      }
    }
  }


};