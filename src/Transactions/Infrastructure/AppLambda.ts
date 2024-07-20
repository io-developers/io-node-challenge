import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import serverlessExpress from '@codegenie/serverless-express';
import { Context, Handler } from 'aws-lambda';
import express from 'express';

import { AppModule } from './AppModule';

let cachedServer: Handler;

async function bootstrap() {
  console.log('-- bootstrap --');
  if (!cachedServer) {
    const expressApp = express();
    const nestApp = await NestFactory.create(
        AppModule,
      new ExpressAdapter(expressApp),
    );
    nestApp.enableCors();
    await nestApp.init();

    cachedServer = serverlessExpress({ app: expressApp });
  }

  return cachedServer;
}

export const handler = async (event: any, context: Context, callback: any) => {
  console.log('-- handler --');
  const server = await bootstrap();
  //console.log(event);
  return server(event, context, callback);
};