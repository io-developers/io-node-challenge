import type { Context, APIGatewayProxyResult, APIGatewayEvent } from 'aws-lambda';
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { PaymentTransactionRequest } from './infra/PaymentTransactionRequest';
import { ProcessPaymentCommandHandler } from './app/ProcessPayment/ProcessPaymentCommandHandler';
import { PaymentProcessorSdk } from './infra/PaymentProcessorSdk';
import { DynamoTransactionRepo } from './infra/DynamoTransactionRepo';
import { ProcessPaymentCommand } from './app/ProcessPayment/ProcessPaymentCommand';
import { GetTransactionRequest } from './infra/GetTransactionRequest';
import { GetTransactionQuery } from './app/GetTransaction/GetTransactionQuery';
import { GetTransactionQueryHandler } from './app/GetTransaction/GetTransactionQueryHandler';
import { HttpApi } from '../shared/HttpApi';
import { EventPublisher } from '../shared/EventPublisher';
import { Logger } from '../shared/Logger';

const dynamodb = new DynamoDBClient();

export const getTransactionsHandler = async (event: APIGatewayEvent, _: Context): Promise<APIGatewayProxyResult> => {
  try {
    const params = GetTransactionRequest.parse(event.queryStringParameters ?? {});
    const repo = new DynamoTransactionRepo(dynamodb, process.env.TRANSACTION_TABLE ?? 'transactions');
    const query = new GetTransactionQuery(params);
    const transactionQueryHandler = new GetTransactionQueryHandler(repo);
  
    const { ok, err } = await transactionQueryHandler.handle(query);
  
    if (err) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: err.message,
        }),
      };
    }
  
    return {
      statusCode: 200,
      body: JSON.stringify(ok),
    };
  } catch (error) {
    Logger.error(error);

    return {
      statusCode: 500,
      body: JSON.stringify({
        message: `Failed to get transactions. Details: ${(error as Error).message}`
      }),
    };
  }
};

export const executePaymentHandler = async (event: APIGatewayEvent, _: Context): Promise<APIGatewayProxyResult> => {
    try {
      const payload = PaymentTransactionRequest.parse(event.body ?? '{}');
      const http = new HttpApi({
        baseUrl: process.env.PAYMENT_PROCESSOR_URL ?? '',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const executePaymentHandler = new ProcessPaymentCommandHandler(
        EventPublisher.getInstance(),
        new PaymentProcessorSdk(http),
        new DynamoTransactionRepo(dynamodb, process.env.TRANSACTION_TABLE ?? 'transactions'),
      );
    
      const command = new ProcessPaymentCommand({
        userId: payload.userId,
        amount: payload.amount,
      });

      const { ok, err } = await executePaymentHandler.handle(command);

      if (err) {
        return {
          statusCode: 400,
          body: JSON.stringify({
            message: err.message,
          }),
        };
      }

      return {
        statusCode: 200,
        body: JSON.stringify(ok),
      };
    } catch (err) {
      Logger.error(err);

      return {
        statusCode: 500,
        body: JSON.stringify({
          message: `Failed to process payment. Details: ${(err as Error).message}`
        }),
      };
    }
}