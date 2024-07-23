import { DynamoDBStreamEvent } from 'aws-lambda';
import { ActivityService } from '../services/activity.service';
import { Logger } from '../../infrastructure/logging/Logger';
import { dynamoDbClient } from '../../infrastructure/database/dynamodb.client';
import { DynamoDBActivityRepository } from '../../infrastructure/repository/activity.repository';
import { Activity } from '../../domain/entities/activity.entity';
import { v4 as uuidv4 } from 'uuid';

const logger = new Logger();
const repository = new DynamoDBActivityRepository(dynamoDbClient, logger);
const activityService = new ActivityService(repository, logger);

export const handler = async (event: DynamoDBStreamEvent): Promise<void> => {
  try {
    for (const record of event.Records) {
      if (record.eventName === 'INSERT') {
        const newImage = record.dynamodb?.NewImage;
        if (newImage) {
          const transactionId = newImage.transactionId.S;

          const activityItem: Activity = {
            activityId: uuidv4(),
            transactionId: transactionId,
            date: new Date().toISOString(),
          };

          await activityService.add(activityItem);

          logger.info(`Activity for transaction ${transactionId} inserted successfully`);
        }
      }
    }
  } catch (error) {
    logger.error(`[ActivityHandler]Error processing records: ${error}`);
    throw error;
  }

};


