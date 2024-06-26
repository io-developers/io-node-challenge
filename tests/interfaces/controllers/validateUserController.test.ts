import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { Transaction } from '../../../src/domain/models/Transaction';
import { UserService } from '../../../src/application/services/UserService';
import { validateUser } from '../../../src/interfaces/controllers/validateUserController';
import mocked = jest.mocked;
import { AppError } from '../../../src/infrastructure/errors/AppError';
import { BadRequestError } from '../../../src/infrastructure/errors/BadRequestError';

jest.mock('../../../src/application/services/UserService');

describe('validateUserController', () => {
  let mockTransaction: Transaction;
  let mockApiResponse: APIGatewayProxyResult;

  beforeEach(() => {
    jest.resetAllMocks();

    mockTransaction = {
      userId: 'test-user-id',
    } as Transaction;

    mockApiResponse = {
      statusCode: 200,
      body: JSON.stringify(mockTransaction),
    };
  });

  const createApiResponse = (statusCode:any, body: any): APIGatewayProxyResult => {
    return {
      statusCode: statusCode,
      body: JSON.stringify(body),
    };
  };

  test('should validate user successfully and return 200 response', async () => {
    mocked(UserService.prototype.validateUser).mockResolvedValueOnce(null);

    const result = await validateUser(mockTransaction);

    expect(UserService.prototype.validateUser).toHaveBeenCalledWith('test-user-id');
    expect(result).toEqual(mockTransaction);
  });

  test('should throw BadRequestError if userId is missing', async () => {
    const mockErrorResponse = new BadRequestError('User ID is required');

    const mockTransactionMissingUserId = {} as Transaction;

    try {
      await validateUser(mockTransactionMissingUserId);
    } catch (error) {
      expect(UserService.prototype.validateUser).not.toHaveBeenCalled();
      expect(error).toEqual(mockErrorResponse);
    }
  });
});
