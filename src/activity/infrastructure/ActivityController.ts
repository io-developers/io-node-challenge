import { DynamoDBStreamEvent } from 'aws-lambda';
import { DynamoDBActivityRepository } from './DynamoDBActivityRepository';
import { RegisterActivityUseCase } from '../application/RegisterActivityUseCase';
import logger from '../../common/Logger';

export const registerActivity = async (event: DynamoDBStreamEvent) => {
  const activityRepository = new DynamoDBActivityRepository();
  const registerActivityUseCase = new RegisterActivityUseCase(
    activityRepository,
  );
  logger.info('Processing event', { event });
  for (const record of event.Records) {
    if (record.eventName === 'INSERT' && record.dynamodb?.NewImage) {
      const transactionId = record.dynamodb.NewImage.transactionId.S!;
      try {
        await registerActivityUseCase.execute(transactionId);
        logger.info(`Activity registered for transactionId: ${transactionId}`);
      } catch (error) {
        logger.error(
          `Failed to register activity for transactionId: ${transactionId}`,
          error,
        );
      }
    }
  }
};
