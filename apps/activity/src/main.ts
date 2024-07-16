import { Callback, Context, Handler } from 'aws-lambda';
import { NestFactory } from '@nestjs/core';
import { ActivityModule } from './infraestructure/activity.module';
import { ActivityController } from './infraestructure/activity.controller';

module.exports.handler = async (
  event: any,
  context: Context,
  callback: Callback,
) => {
  const appContext = await NestFactory.createApplicationContext(ActivityModule);
  const eventsService = appContext.get(ActivityController);
  try {
    const { Records } = event
    const dataToProcess: { userId: string, transactionId: string }[] = Records.map(eventInRecord => {
      return {
        userId: eventInRecord.dynamodb.NewImage.userId.S,
        transactionId: eventInRecord.dynamodb.NewImage.transactionId.S
      }
    });
    const promises = dataToProcess.map((event) => eventsService.registerActivity(event))
    await Promise.all(promises)
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        success: true,
      }),
    }
  } catch (error) {
    return {
      statusCode: error?.statusCode ?? 400,
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
// import { ActivityModule } from './infraestructure/activity.module';
// async function bootstrap() {
//   const app = await NestFactory.create(ActivityModule);
//   await app.listen(3000);
// }
// bootstrap();