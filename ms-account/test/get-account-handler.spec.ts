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

  it('should return 400 if accountId is missing', async () => {
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

    expect(result.statusCode).toBe(400);
    expect(JSON.parse(result.body)).toEqual({ message: 'Missing accountId parameter' });
  });

  it('should return 200 if account is found', async () => {
    executeSpy.mockResolvedValue({ status: 'OK', account: { id: '123', name: 'Test Account' } });

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
    expect(JSON.parse(result.body)).toEqual({ status: 'OK', account: { id: '123', name: 'Test Account' } });
  });

  it('should return 404 if account is not found', async () => {
    executeSpy.mockResolvedValue({ status: 'NOT_FOUND' });

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
    expect(JSON.parse(result.body)).toEqual({ status: 'NOT_FOUND' });
  });
});