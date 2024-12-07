/* eslint-disable @typescript-eslint/no-explicit-any */
import { getAccountHandler } from './../src/infraestructure/handlers/get-account.handler';
import { APIGatewayProxyEvent } from 'aws-lambda';
import { GetAccountUsecase } from './../src/application/usecases/get-account.usecase';

describe('getAccountHandler', () => {
  let executeSpy: jest.SpyInstance;

  beforeEach(() => {
    executeSpy = jest.spyOn(GetAccountUsecase.prototype, 'execute');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return 404 if accountId is missing', async () => {
    const event: APIGatewayProxyEvent = {
      body: null,
      headers: {},
      multiValueHeaders: {},
      httpMethod: 'GET',
      isBase64Encoded: false,
      path: '',
      pathParameters: null,
      queryStringParameters: null,
      multiValueQueryStringParameters: null,
      stageVariables: null,
      requestContext: {} as any,
      resource: '',
    };

    const result = await getAccountHandler(event);

    expect(result.statusCode).toBe(404);
    expect(JSON.parse(result.body)).toEqual({ message: 'Missing accountId parameter' });
  });

  it('should return 200 if account is found', async () => {
    executeSpy.mockResolvedValue({ id: "123", amount: "100" });

    const event: APIGatewayProxyEvent = {
      body: null,
      headers: {},
      multiValueHeaders: {},
      httpMethod: 'GET',
      isBase64Encoded: false,
      path: '',
      pathParameters: { accountId: '123' },
      queryStringParameters: null,
      multiValueQueryStringParameters: null,
      stageVariables: null,
      requestContext: {} as any,
      resource: '',
    };

    const result = await getAccountHandler(event);

    expect(result.statusCode).toBe(200);
    expect(JSON.parse(result.body)).toEqual({ id: "123", amount: "100" });
  });

  it('should return 404 if account is not found', async () => {
    executeSpy.mockResolvedValue({ mesage: 'Account not found' });

    const event: APIGatewayProxyEvent = {
      body: null,
      headers: {},
      multiValueHeaders: {},
      httpMethod: 'GET',
      isBase64Encoded: false,
      path: '',
      pathParameters: { accountId: '123' },
      queryStringParameters: null,
      multiValueQueryStringParameters: null,
      stageVariables: null,
      requestContext: {} as any,
      resource: '',
    };

    const result = await getAccountHandler(event);

    expect(result.statusCode).toBe(404);
    expect(JSON.parse(result.body)).toEqual({ mesage: 'Account not found' });
  });
});