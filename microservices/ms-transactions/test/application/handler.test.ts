import { handler } from '../../src/application/handlers/handler';
import { APIGatewayProxyEventBase, APIGatewayEventDefaultAuthorizerContext } from 'aws-lambda';
import { TransactionService } from '../../src/application/services/transaction.service';

jest.mock('../../src/application/services/transaction.service');

describe('application.handler.test', () => {

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should return a successful response', async () => {

    const event: APIGatewayProxyEventBase<APIGatewayEventDefaultAuthorizerContext> = {
      pathParameters: null,
      body: null,
      headers: {},
      multiValueHeaders: {},
      httpMethod: 'GET',
      isBase64Encoded: false,
      path: '/v1/transactions',
      resource: '',
      stageVariables: {},
      requestContext: {} as any,
      multiValueQueryStringParameters: null,
      queryStringParameters: { transaction_id: '12345' },
    };

    jest.mocked(TransactionService.prototype.findById).mockResolvedValueOnce({ transactionId: "12345", userId: "100200300", amount: 100 });

    const response = await handler(event);

    expect(response.statusCode).toBe(200);
    expect(response.body).toBe('{\"transactionId\":\"12345\",\"userId\":\"100200300\",\"amount\":100}');
  });

  it('should return an error if service throw an exception', async () => {
    jest.mocked(TransactionService.prototype.findById).mockRejectedValueOnce(new Error('Internal Server Error'));

    const event: APIGatewayProxyEventBase<APIGatewayEventDefaultAuthorizerContext> = {
      pathParameters: null,
      body: null,
      headers: {},
      multiValueHeaders: {},
      httpMethod: 'GET',
      isBase64Encoded: false,
      path: '/v1/transactions',
      resource: '',
      stageVariables: {},
      requestContext: {} as any,
      multiValueQueryStringParameters: null,
      queryStringParameters: { transaction_id: '123456' },
    };

    const response = await handler(event);

    expect(response.statusCode).toBe(500);
    expect(response.body).toBe('{"message":{}}');

  });

  it('should return an error if transactionId not exists', async () => {
    jest.mocked(TransactionService.prototype.findById).mockResolvedValueOnce(null);

    const event: APIGatewayProxyEventBase<APIGatewayEventDefaultAuthorizerContext> = {
      pathParameters: null,
      body: null,
      headers: {},
      multiValueHeaders: {},
      httpMethod: 'GET',
      isBase64Encoded: false,
      path: '/v1/transactions',
      resource: '',
      stageVariables: {},
      requestContext: {} as any,
      multiValueQueryStringParameters: null,
      queryStringParameters: { transaction_id: '123457' },
    };

    const response = await handler(event);

    expect(response.statusCode).toBe(404);
    expect(response.body).toBe('{\"message\":\"Transaction not found\",\"transactionId\":\"123457\"}');

  });

  it('should return a not found response if the transaction is not found', async () => {
    const event: APIGatewayProxyEventBase<APIGatewayEventDefaultAuthorizerContext> = {
      pathParameters: null,
      body: null,
      headers: {},
      multiValueHeaders: {},
      httpMethod: 'GET',
      isBase64Encoded: false,
      path: '/v1/transactions',
      resource: '',
      stageVariables: {},
      requestContext: {} as any,
      multiValueQueryStringParameters: null,
      queryStringParameters: null,
    };

    jest.mocked(TransactionService.prototype.findById).mockRejectedValueOnce(null);

    const response = await handler(event);

    expect(response.statusCode).toBe(400);
    expect(response.body).toBe('{\"message\":\"Missing transactionId\"}');
  });
});