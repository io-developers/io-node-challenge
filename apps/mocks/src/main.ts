import { Callback, Context, Handler } from 'aws-lambda';
import { NestFactory } from '@nestjs/core';
import { MocksModule } from './infraestructure/mocks.module';
import { MocksController } from './infraestructure/mocks.controller';

module.exports.handler = async (
  event: any,
  context: Context,
  callback: Callback,
) => {
  const appContext = await NestFactory.createApplicationContext(MocksModule);
  const eventsService = appContext.get(MocksController);
  const {body} = event;
  let newEvent = {...event}
  if (body) {
    newEvent = JSON.parse(body)
  }
  try {
    const result = await eventsService.executePayment(newEvent);
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
// import { MocksModule } from './infraestructure/mocks.module';
// async function bootstrap() {
//   const app = await NestFactory.create(MocksModule);
//   await app.listen(3000);
// }
// bootstrap();