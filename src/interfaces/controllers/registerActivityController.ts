import { DynamoDBStreamHandler } from 'aws-lambda';
import { ActivityService } from '../../application/services/ActivityService';
import { ActivityRepository } from '../../domain/repositories/ActivityRepository';
import { logger } from '../../infrastructure/utils';
import { handleError } from '../http/errorHandler';
const activityRepository = new ActivityRepository();
const activityService = new ActivityService(activityRepository);

export const registerActivityController: DynamoDBStreamHandler = async (event) => {
  for (const record of event.Records) {
    if (record.eventName === 'INSERT') {
      const transactionId = record.dynamodb?.NewImage?.transactionId.S;

      if (transactionId) {
        try {
          await activityService.recordActivity(transactionId);
          logger.info(`Activity registered for transaction: ${transactionId}`);
        } catch (error) {
          const err = error as Error;
          handleError(err);
        }
      }
    }
  }
};
