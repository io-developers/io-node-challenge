import { Callback, Context, Handler } from 'aws-lambda';
import { NestFactory } from '@nestjs/core';
import { TransactionModule } from './infraestructure/transaction.module';
import { TransactionController } from './infraestructure/transaction.controller';

module.exports.handler = async (
  event: any,
  context: Context,
  callback: Callback,
) => {
  const appContext = await NestFactory.createApplicationContext(TransactionModule);
  const eventsService = appContext.get(TransactionController);
  const newEvent = {...event, ...event.queryStringParameters?? undefined }
  const { transactionId } = newEvent;

  try {
    const result = await eventsService.getTransaction(transactionId);
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        success: true,
        result
      }),
    }
  } catch (error) {
    return {
      statusCode: error?.statusCode ?? 400 ,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        success: false,
        message: error?.message ?? 'Error no controlado'
      }),
    }
  }
};
// import { NestFactory } from '@nestjs/core';
// import { TransactionModule } from './infraestructure/transaction.module';

// async function bootstrap() {
//   const app = await NestFactory.create(TransactionModule);
//   await app.listen(3000);
// }
// bootstrap();