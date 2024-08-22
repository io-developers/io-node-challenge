import { executePayment } from '../../../src/application/controllers/transactionMock';
import {APIGatewayEventDefaultAuthorizerContext, APIGatewayProxyEventBase} from "aws-lambda";

describe('payment.transaction.mock', () => {
  const event: APIGatewayProxyEventBase<APIGatewayEventDefaultAuthorizerContext> = {
    pathParameters: null,
    body: JSON.stringify({ userId: '12345' }),
    headers: {},
    multiValueHeaders: {},
    httpMethod: 'GET',
    isBase64Encoded: false,
    path: '/v1/transactions',
    resource: '',
    stageVariables: {},
    requestContext: {} as any,
    multiValueQueryStringParameters: null,
    queryStringParameters: {},
  };

  beforeEach(() => {
    jest.resetAllMocks();
    event.body = JSON.stringify({ userId: '12345' });
  });

  it('should execute payment and return success', async () => {

    const response = await executePayment(event);
    const body = JSON.parse(response.body);
    expect(response.statusCode).toEqual(200);

    expect(body).toEqual({
      userId: '12345',
      transactionId: expect.any(String),
      status: 'success'
    });
  });

  it('handles missing userId gracefully', async () => {
    event.body = JSON.stringify({});

    const response = await executePayment(event);

    expect(response.statusCode).toEqual(400);
    expect(response.body).toContain('{\"message\":\"Missing required field: userId\"}');
  });
});
