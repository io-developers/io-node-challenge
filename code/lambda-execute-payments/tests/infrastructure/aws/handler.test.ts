
import { APIGatewayProxyEvent, Context} from 'aws-lambda';
import { handler } from '../../../src/infrastructure/aws/lambda';
import { CreatePayment } from '../../../src/application/createPayment';

jest.mock('../../../src/application/createPayment');
const mockCreatePayment = CreatePayment as jest.MockedClass<typeof CreatePayment>;



describe('Handler', () => {

  let mockEvent: APIGatewayProxyEvent;
  let mockContext: Context;


  beforeEach(() => {
    jest.resetAllMocks();

    mockEvent = {
      userId: "123",
      amount: "100"
    } as unknown as APIGatewayProxyEvent;

    mockContext = {} as Context;


  });

  it('should return 500 if transactionRequest is null', async () => {

    mockEvent = {
      userId: null,
      amount: null
    } as unknown as APIGatewayProxyEvent;
    const transactionResponse = { transactionId: '123', userId: '123', amount: '100' };

    mockCreatePayment.prototype.execute.mockResolvedValueOnce(transactionResponse);

    const result = await handler(mockEvent, mockContext, () => null);

    expect(result?.statusCode).toBe(500);
    //expect(result.body).toBe(JSON.stringify({ message: 'Invalid payment request' }));
  });


  it('should return 200 with transaction data', async () => {

    const transactionResponse = { transactionId: '123', userId: '123', amount: '100' };

    mockCreatePayment.prototype.execute.mockResolvedValueOnce(transactionResponse);

    const response = await handler(mockEvent, mockContext, () => null);

    expect(response?.statusCode).toBe(200);
    expect(response?.body).toEqual(JSON.stringify(transactionResponse));

  });
});
