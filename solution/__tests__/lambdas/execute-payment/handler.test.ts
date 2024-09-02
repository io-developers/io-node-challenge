import { handler } from '../../../src/lambdas/update-account/handler';
import { ExecutePaymemtDependencyInjectionContainer } from '../../../src/lambdas/execute-payment/execute-payment-di';
import { ExecutePaymentUseCase } from '../../../src/lambdas/execute-payment/execute-payment-use-case';
import { DynamoDBStreamEvent } from 'aws-lambda';


jest.mock('../../../src/lambdas/execute-payment/execute-payment-di');

class MockExecutePaymentUseCase extends ExecutePaymentUseCase {
  constructor() {
    super({} as any);
  }

  executePayment = jest.fn();
}

describe('execute-payment handler', () => {
  let mockExecutePaymentUseCase: MockExecutePaymentUseCase;

  beforeEach(() => {
    mockExecutePaymentUseCase = new MockExecutePaymentUseCase();

    jest.spyOn(ExecutePaymemtDependencyInjectionContainer.prototype, 'executePaymentUseCase', 'get').mockReturnValue(mockExecutePaymentUseCase);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return transactionId and generatedId on successful payment', async () => {
    const mockEvent: DynamoDBStreamEvent = {
        Records: [
          {
            eventName: 'INSERT',
            dynamodb: {
              NewImage: {
                accountId: { S: '12345' },
                amount: { N: '100.50' },
              },
            },
          },
        ],
      };

    const mockTransactionId = '12345';

    mockExecutePaymentUseCase.executePayment.mockResolvedValue(mockTransactionId);

    const response = await handler(mockEvent);

    expect(mockExecutePaymentUseCase.executePayment).toHaveBeenCalledWith('12345', 100.50);
    expect(mockExecutePaymentUseCase.executePayment).toHaveBeenCalledTimes(1);

    expect(response).toEqual({
      transactionId: mockTransactionId,
      id: expect.any(Number)
    });
  });

  it('should throw an error when payment fails', async () => {
    const mockEvent: DynamoDBStreamEvent = {
        Records: [
          {
            eventName: 'INSERT',
            dynamodb: {
              NewImage: {
                accountId: { S: '12345' },
                amount: { N: '100.50' },
              },
            },
          },
        ],
      };
    mockExecutePaymentUseCase.executePayment.mockRejectedValue(new Error('Could not process payment'));

    await expect(handler(mockEvent)).rejects.toThrow('Could not process payment');

    expect(mockExecutePaymentUseCase.executePayment).toHaveBeenCalledWith('12345', 100.50);
    expect(mockExecutePaymentUseCase.executePayment).toHaveBeenCalledTimes(1);
  });
});