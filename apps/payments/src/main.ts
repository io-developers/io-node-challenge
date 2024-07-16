import { Callback, Context, Handler } from 'aws-lambda';
import { NestFactory } from '@nestjs/core';
import { PaymentsModule } from './infraestructure/payments.module';
import { PaymentsController } from './infraestructure/payments.controller';

module.exports.handler = async (
  event: any,
  context: Context,
  callback: Callback,
) => {
  const appContext = await NestFactory.createApplicationContext(PaymentsModule);
  const eventsService = appContext.get(PaymentsController);
  try {
    const result = await eventsService.exectPayments(event);
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
}