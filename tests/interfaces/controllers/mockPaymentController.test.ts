import { APIGatewayProxyEvent, APIGatewayProxyResult, Context, Callback } from 'aws-lambda';
import { ValidationService } from '../../../src/application/services/ValidationService';
import { logger } from '../../../src/infrastructure/utils/Logger';
import { mockPaymentController } from '../../../src/interfaces/controllers/mockPaymentController';
import { successResponse, errorResponse } from '../../../src/interfaces/http/responseHandler';
import { AppError } from '../../../src/infrastructure/errors/AppError';

jest.mock('../../../src/application/services/ValidationService');
jest.mock('../../../src/infrastructure/utils/Logger');
jest.mock('../../../src/interfaces/http/responseHandler');

const mockedValidationService = jest.mocked(ValidationService);

describe('mockPaymentController', () => {
  let mockEvent: APIGatewayProxyEvent;
  let mockContext: Context;
  let mockCallback: jest.Mock<Callback<APIGatewayProxyResult>>;

  beforeEach(() => {
    jest.resetAllMocks();

    mockEvent = {
      body: JSON.stringify({
        paymentDetails: 'some-payment-details',
      }),
    } as unknown as APIGatewayProxyEvent;

    mockContext = {} as Context;
    mockCallback = jest.fn();

    jest.spyOn(logger, 'info').mockImplementation(() => {});
    jest.spyOn(logger, 'error').mockImplementation(() => {});
  });

  test('should process payment successfully and return 200 response', async () => {
    const mockResponse: APIGatewayProxyResult = {
      statusCode: 200,
      body: JSON.stringify({ success: true }),
    };

    mockedValidationService.prototype.validatePaymentRequest.mockReturnValue({ transactionId: '12345', userId: 'success', amount: 100 });
    (successResponse as jest.Mock).mockReturnValue(mockResponse);

    await mockPaymentController(mockEvent, mockContext, mockCallback);

    expect(mockedValidationService.prototype.validatePaymentRequest).toHaveBeenCalledWith(mockEvent.body);
    expect(successResponse).toHaveBeenCalledWith(200, { transactionId: '12345', userId: 'success', amount: 100 });
  });

  test('should return 500 response when validatePaymentRequest throws an error', async () => {
    const mockError = new AppError('Internal Server Error');
    const mockErrorResponse: APIGatewayProxyResult = {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error' }),
    };

    mockedValidationService.prototype.validatePaymentRequest.mockImplementation(() => {
      throw mockError;
    });
    (errorResponse as jest.Mock).mockReturnValue(mockErrorResponse);

    await mockPaymentController(mockEvent, mockContext, mockCallback);

    expect(mockedValidationService.prototype.validatePaymentRequest).toHaveBeenCalledWith(mockEvent.body);
    expect(errorResponse).toHaveBeenCalledWith(500, 'Internal Server Error');
  });
});
