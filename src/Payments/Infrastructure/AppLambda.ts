import { NestFactory } from '@nestjs/core';
import { INestApplicationContext } from '@nestjs/common';
import { Context } from 'aws-lambda';
import { AppModule } from './AppModule';
import { PaymentModule } from './PaymentModule';
import { PaymentController } from './PaymentController';
import { UtilsLambda } from '../../Commons/UtilsLambda';

let appContext: INestApplicationContext;

async function bootstrap() {
  console.log('-- bootstrap --');
  if (!appContext) {
    appContext = await NestFactory.createApplicationContext(AppModule);
  }
  return appContext.select(PaymentModule).get(PaymentController);
}

export const handler = async (event: any, context: Context, callback: any) => {
  console.log('-- handler --');
  try {
    const appContext = await bootstrap();
    console.log({ event });
    console.log('--------------------------');
    const requestController = UtilsLambda.getRequestController(event);
    const response = await appContext.execute(requestController.action, requestController.request);
    console.log({ response });
    const responseLambda = UtilsLambda.getResponseLambda(response);
    console.log({ responseLambda });
    callback(null, responseLambda);
  } catch (error) {
    console.log({ error });
    const responseLambda = UtilsLambda.getResponseLambdaError(error);
    callback(null, responseLambda);
  }
};