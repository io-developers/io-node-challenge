import { NestFactory } from '@nestjs/core';
import { INestApplicationContext } from '@nestjs/common';
import { Context } from 'aws-lambda';
import { AppModule } from './AppModule';
import { ActivityModule } from './ActivityModule';
import { ActivityController } from './ActivityController';
import { UtilsLambda } from '../../Commons/UtilsLambda';

let appContext: INestApplicationContext;

async function bootstrap() {
  console.log('-- bootstrap --');
  if (!appContext) {
    appContext = await NestFactory.createApplicationContext(AppModule);
  }
  return appContext.select(ActivityModule).get(ActivityController);
}

export const handler = async (event: any, context: Context, callback: any) => {
  try {
    console.log('-- handler --');
    const appContext = await bootstrap();
    const { eventName, dynamodb } = UtilsLambda.getRequestStremDynamoDB(event);
    const request: any = {};
    let action = null;
    if (eventName === 'INSERT') {
      action = 'create'
      const transactionId = dynamodb.Keys.transactionId.S;
      request.transactionId = transactionId;
    } else {
      throw new Error('Invalid event name: ' + eventName);
    }
    const response = await appContext.execute(action, request);
    console.log({ response });
    const responseLambda = UtilsLambda.getResponseLambda(response);
    callback(null, responseLambda);
  } catch (error) {
    console.log({ error });
    const responseLambda = UtilsLambda.getResponseLambdaError(error);
    callback(null, responseLambda);
  }
};