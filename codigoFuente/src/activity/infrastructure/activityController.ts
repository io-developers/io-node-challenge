import { DynamoDBStreamHandler } from 'aws-lambda';
import { ActivityService } from '../application/ActivityService';
import { ActivityRepository } from './ActivityRepository';
import { InternalServerError } from '../../helper/utils/InternalServerError';
import { NotFoundError } from '../../helper/utils/NotFoundError';
import dynamoDbClient from './db/DynamoDbClient';
import { logger } from '../../helper/logs/Logger';
import { Activity } from '../domain/entitys/activity.entity';



const activityRepository = new ActivityRepository(dynamoDbClient, logger);
const activityService = new ActivityService(activityRepository, logger);

export const activityProcess: DynamoDBStreamHandler = async (event) => {


  logger.info('Processing DynamoDB stream event ', { event });

  for (const record of event.Records) {

    if (record.eventName === 'INSERT') {
      const transactionId = record.dynamodb?.NewImage?.transactionId?.S;
      
      const activity = new Activity(transactionId);

      logger.info(`Processing transaction :  ${activity.transactionId}`);

      if (transactionId) {
        try {
          const state = await activityService.registryActivity(activity);
          logger.info(`Register activity success : ${state}`);
          logger.info(`Activity registered in table activity history: ${transactionId}`);
        } catch (error) {
          logger.error('Error found in activity register', { error: error });
          throw new InternalServerError(`Error in registering activity`);
        }
      } else {
        logger.error('Transaction is not found', { record });
        throw new NotFoundError(`TransactionId is not found`);
      }
    }
  }
};
