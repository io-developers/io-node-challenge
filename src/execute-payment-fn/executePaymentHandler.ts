import { APIGatewayProxyHandler } from 'aws-lambda';
import { AxiosHttpClient } from './dependencyInjectionContainer/paymentGatewayClient';
import { ExternalApiRepositoryImpl } from './repositories/externalApiRepository';
import { ExecutePaymentUseCaseUseCase } from './useCases/executePaymentUseCase';
import { PaymentResponse } from './utils/types';
import * as dotenv from 'dotenv';
dotenv.config();

const EXTERNAL_API_URL = process.env.EXTERNAL_PAYMENT_API!;

const httpClient = new AxiosHttpClient();
const externalApiRepository = new ExternalApiRepositoryImpl(httpClient, EXTERNAL_API_URL);
const sendMessageUseCase = new ExecutePaymentUseCaseUseCase(externalApiRepository);

export const handler = async (event) => {
  try {
    var messageStream = await sendMessageUseCase.execute({
      accountId: event.accountId,
      amount: event.amount
    });
    console.info('Send data DynamoStream: ' + JSON.stringify(messageStream));
    return messageStream;
  } catch (error) {

    return {
      statusCode: 400,
      body: JSON.stringify({ message: '"Something was wrong"' }),
    };
  }
};
