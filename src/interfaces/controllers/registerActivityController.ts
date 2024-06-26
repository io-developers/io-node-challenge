import { DynamoDBStreamHandler } from 'aws-lambda';
import { ActivityService } from '../../application/services/ActivityService';
import { ActivityRepository } from '../../domain/repositories/ActivityRepository';
import { InternalServerError } from '../../infrastructure/errors/DatabaseError';
import dynamoDbClient from '../../infrastructure/database/DynamoDBClient';
import { logger } from '../../infrastructure/utils/Logger';

const activityRepository = new ActivityRepository(dynamoDbClient, logger);
const activityService = new ActivityService(activityRepository, logger);

export const registerActivityController: DynamoDBStreamHandler = async (event) => {
  logger.info('Processing DynamoDB stream event', { event });

  for (const record of event.Records) {
    if (record.eventName === 'INSERT') {
      const transactionId = record.dynamodb?.NewImage?.transactionId?.S;

      if (transactionId) {
        try {
          await activityService.recordActivity(transactionId);
          logger.info(`Activity registered for transaction: ${transactionId}`);
        } catch (error) {
          const err = error as Error;
          logger.error('Error in registering activity', { error: err });
          throw new InternalServerError(`Error in registering activity: ${err.message}`);
        }
      } else {
        logger.error('Transaction ID not found in DynamoDB stream record', { record });
      }
    }
  }
};
