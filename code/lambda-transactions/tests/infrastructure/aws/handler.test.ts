
import { APIGatewayProxyEvent, APIGatewayProxyResult, Context, Callback } from 'aws-lambda';
import { handler } from '../../../src/infrastructure/aws/lambda';
import { GetTransactionById } from '../../../src/application/getTransactionById';


jest.mock('../../../src/application/getTransactionById');

const mockGetTransactionById = GetTransactionById as jest.MockedClass<typeof GetTransactionById>;

describe('getHandler', () => {
  let mockEvent: APIGatewayProxyEvent;
  let mockContext: Context;
  let callback: jest.Mock<Callback<APIGatewayProxyResult>>;

  beforeEach(() => {
    jest.resetAllMocks();

    mockEvent = {
      queryStringParameters: {
        transactionId: '123',
      },
    } as unknown as APIGatewayProxyEvent;

    mockContext = {} as Context;
  });

describe('handler', () => {


  it('should return 400 if transactionId is not provided', async () => {

    mockEvent.queryStringParameters = {};
    const response = await handler(mockEvent, mockContext, callback);

    expect(response?.statusCode).toBe(400);
    expect(response?.body).toEqual("{\"message\":\"Transaction ID is required\"}");
  });


  it('should return 404 if transaction is not found', async () => {
    mockGetTransactionById.prototype.execute.mockResolvedValueOnce(null);

    const response = await handler(mockEvent, mockContext, () => null);

    expect(response?.statusCode).toBe(404);
    expect(response?.body).toEqual("{\"message\":\"Transaction not found\"}");
  });


  it('should return 200 and the transaction if found', async () => {
    const mockTransaction = { transactionId: '123', userId: "1234", paymentAmount: "100"};
    mockGetTransactionById.prototype.execute.mockResolvedValueOnce(mockTransaction);

    const response = await handler(mockEvent, mockContext, () => null);

    expect(response?.statusCode).toBe(200);
    expect(response?.body).toEqual(JSON.stringify(mockTransaction));
  });


});

});

