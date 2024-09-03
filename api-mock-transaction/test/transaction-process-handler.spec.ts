import { TransactionProcessUsecase } from '../src/application/usecases/transaction-process.usecase';
import { transactionProcessHandler } from './../src/infraestructure/handlers/transaction-process.handler';
// transaction-process.handler.test.ts
import { APIGatewayProxyEvent } from 'aws-lambda';



jest.mock('../src/application/usecases/transaction-process.usecase');

describe('transactionProcessHandler', () => {
    let executeSpy: jest.SpyInstance;

  beforeEach(() => {
    executeSpy = jest.spyOn(TransactionProcessUsecase.prototype, 'execute');
  });

  it('should return 400 if accountId is missing', async () => {
    const event: APIGatewayProxyEvent = {
      body: JSON.stringify({ amount: 100 }),
      headers: {},
      multiValueHeaders: {},
      httpMethod: 'POST',
      isBase64Encoded: false,
      path: '',
      pathParameters: null,
      queryStringParameters: null,
      multiValueQueryStringParameters: null,
      stageVariables: null,
      requestContext: {} as any,
      resource: '',
    };

    const result = await transactionProcessHandler(event);

    expect(result.statusCode).toBe(400);
    expect(JSON.parse(result.body)).toEqual({ message: 'Missing accountId parameter' });
  });

  it('should return 200 if transaction is successful', async () => {
    executeSpy.mockResolvedValue({ status: 'SUCCESS' });

    const event: APIGatewayProxyEvent = {
      body: JSON.stringify({ accountId: '123', amount: 100 }),
      headers: {},
      multiValueHeaders: {},
      httpMethod: 'POST',
      isBase64Encoded: false,
      path: '',
      pathParameters: null,
      queryStringParameters: null,
      multiValueQueryStringParameters: null,
      stageVariables: null,
      requestContext: {} as any,
      resource: '',
    };

    const result = await transactionProcessHandler(event);
    expect(result.statusCode).toBe(200);

  });

  it('should return 404 if transaction fails', async () => {
    executeSpy.mockResolvedValue({ status: 'FAILURE' });

    const event: APIGatewayProxyEvent = {
      body: JSON.stringify({ accountId: '123', amount: 100 }),
      headers: {},
      multiValueHeaders: {},
      httpMethod: 'POST',
      isBase64Encoded: false,
      path: '',
      pathParameters: null,
      queryStringParameters: null,
      multiValueQueryStringParameters: null,
      stageVariables: null,
      requestContext: {} as any,
      resource: '',
    };

    const result = await transactionProcessHandler(event);

    expect(result.statusCode).toBe(404);
    expect(JSON.parse(result.body)).toEqual({ status: 'FAILURE' });
  });
});