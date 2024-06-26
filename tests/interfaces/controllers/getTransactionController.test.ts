import { APIGatewayProxyEvent, APIGatewayProxyResult, Context, Callback } from 'aws-lambda';
import { TransactionService } from '../../../src/application/services/TransactionService';
import { logger } from '../../../src/infrastructure/utils/Logger';
import { getTransactionController } from '../../../src/interfaces/controllers/getTransactionController';
import { successResponse, errorResponse } from '../../../src/interfaces/http/responseHandler';
import { AppError } from '../../../src/infrastructure/errors/AppError';
import { BadRequestError } from '../../../src/infrastructure/errors/BadRequestError';

jest.mock('../../../src/application/services/TransactionService');
jest.mock('../../../src/infrastructure/utils/Logger');
jest.mock('../../../src/interfaces/http/responseHandler');

const mockedTransactionService = jest.mocked(TransactionService);

describe('getTransactionController', () => {
  let mockEvent: APIGatewayProxyEvent;
  let mockContext: Context;
  let callback: jest.Mock<Callback<APIGatewayProxyResult>>;

  beforeEach(() => {
    jest.resetAllMocks();

    mockEvent = {
      queryStringParameters: {
        transactionId: 'test-transaction-id',
      },
    } as unknown as APIGatewayProxyEvent;

    mockContext = {} as Context;
    callback = jest.fn();

    jest.spyOn(logger, 'info').mockImplementation(() => {});
    jest.spyOn(logger, 'error').mockImplementation(() => {});
  });

  test('should get transaction successfully and return 200 response', async () => {
    const mockResponse: APIGatewayProxyResult = {
      statusCode: 200,
      body: JSON.stringify({ transactionId: 'test-transaction-id', userId: 'test-user-id', amount: 100 }),
    };

    mockedTransactionService.prototype.fetchTransaction.mockResolvedValue({ transactionId: 'test-transaction-id', userId: 'test-user-id', amount: 100 });
    (successResponse as jest.Mock).mockReturnValue(mockResponse);

    await getTransactionController(mockEvent, mockContext, callback);

    expect(mockedTransactionService.prototype.fetchTransaction).toHaveBeenCalledWith('test-transaction-id');
    expect(successResponse).toHaveBeenCalledWith(200, { transactionId: 'test-transaction-id', userId: 'test-user-id', amount: 100 });
  });

  test('should return 400 response when transactionId is missing', async () => {
    mockEvent.queryStringParameters = {};

    const mockErrorResponse: APIGatewayProxyResult = {
      statusCode: 400,
      body: JSON.stringify({ error: 'Transaction ID is required' }),
    };

    (errorResponse as jest.Mock).mockReturnValue(mockErrorResponse);

    await getTransactionController(mockEvent, mockContext, callback);

    expect(mockedTransactionService.prototype.fetchTransaction).not.toHaveBeenCalled();
    expect(errorResponse).toHaveBeenCalledWith(400, 'Transaction ID is required');
  });

  test('should return 500 response when fetchTransaction throws an error', async () => {
    const mockError = new AppError('Internal Server Error');
    const mockErrorResponse: APIGatewayProxyResult = {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error' }),
    };

    mockedTransactionService.prototype.fetchTransaction.mockRejectedValue(mockError);
    (errorResponse as jest.Mock).mockReturnValue(mockErrorResponse);

    await getTransactionController(mockEvent, mockContext, callback);

    expect(mockedTransactionService.prototype.fetchTransaction).toHaveBeenCalledWith('test-transaction-id');
    expect(errorResponse).toHaveBeenCalledWith(500, 'Internal Server Error');
  });
});
