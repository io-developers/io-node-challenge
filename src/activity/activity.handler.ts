import type { DynamoDBStreamEvent } from 'aws-lambda';
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { RegisterActivityCommandHandler } from './app/RegisterActivity/RegisterActivityCommandHandler';
import { DynamoActivityRepo } from './infra/DynamoActivityRepo';
import { RegisterActivityCommand } from './app/RegisterActivity/RegisterActivityCommand';
import { Logger } from '../shared/Logger';

const dynamodb = new DynamoDBClient();

export const registerActivityHandler = async (event: DynamoDBStreamEvent) => {
  try {
    const registerActivityHandler = new RegisterActivityCommandHandler(
      new DynamoActivityRepo(dynamodb, process.env.ACTIVITY_TABLE ?? 'activities')
    );
  
    const commands = event.Records.filter(({ eventName }) => eventName === 'INSERT')
                            .map((record) => 
                              new RegisterActivityCommand({ 
                                transactionId: record?.dynamodb?.NewImage?.transactionId.S ?? "" 
                            }));

    await Promise.allSettled(
      commands.map((command) => registerActivityHandler.handle(command))
    );
  } catch (error) {
    Logger.error(error);
  }
};
