import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { PaymentService } from '../../../src/application/services/PaymentService';
import { logger } from '../../../src/infrastructure/utils/Logger';
import { startPaymentProcessController } from '../../../src/interfaces/controllers/startPaymentProcessController';
import { successResponse, errorResponse } from '../../../src/interfaces/http/responseHandler';
import { AppError } from '../../../src/infrastructure/errors/AppError';

jest.mock('axios');
jest.mock('../../../src/application/services/PaymentService');
jest.mock('../../../src/domain/repositories/PaymentRepository');
jest.mock('../../../src/domain/repositories/TransactionRepository');
jest.mock('../../../src/infrastructure/utils/Logger');
jest.mock('../../../src/interfaces/http/responseHandler');

const mockedPaymentService = jest.mocked(PaymentService);

describe('startPaymentProcessController', () => {
  let mockEvent: APIGatewayProxyEvent;
  let mockContext: Context;
  let callback: jest.Mock;

  beforeEach(() => {
    jest.resetAllMocks();

    mockEvent = {
      body: JSON.stringify({
        userId: 'test-user-id',
        amount: 100,
      }),
    } as unknown as APIGatewayProxyEvent;

    mockContext = {} as Context;
    callback = jest.fn();

    jest.spyOn(logger, 'info').mockImplementation(() => {});
    jest.spyOn(logger, 'error').mockImplementation(() => {});
  });

  test('should start payment process successfully and return 200 response', async () => {
    const mockResponse: APIGatewayProxyResult = {
      statusCode: 200,
      body: JSON.stringify({ success: true }),
    };

    mockedPaymentService.prototype.startPaymentProcess.mockResolvedValue({ message: 'Payment started', transactionId: '12345' });
    (successResponse as jest.Mock).mockReturnValue(mockResponse);

    await startPaymentProcessController(mockEvent, mockContext, callback);

    expect(mockedPaymentService.prototype.startPaymentProcess).toHaveBeenCalledWith('test-user-id', 100);
    expect(successResponse).toHaveBeenCalledWith(200, { message: 'Payment started', transactionId: '12345' });
  });

  test('should return 500 response when startPaymentProcess throws an error', async () => {
    const mockError = new AppError('Internal Server Error');
    const mockErrorResponse: APIGatewayProxyResult = {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error' }),
    };

    mockedPaymentService.prototype.startPaymentProcess.mockRejectedValue(mockError);
    (errorResponse as jest.Mock).mockReturnValue(mockErrorResponse);

    await startPaymentProcessController(mockEvent, mockContext, callback);

    expect(mockedPaymentService.prototype.startPaymentProcess).toHaveBeenCalledWith('test-user-id', 100);
    expect(errorResponse).toHaveBeenCalledWith(500, 'Internal Server Error');
  });
});
