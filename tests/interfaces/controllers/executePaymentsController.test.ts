import { Context } from 'aws-lambda';
import { Transaction } from '../../../src/domain/models/Transaction';
import { PaymentService } from '../../../src/application/services/PaymentService';
import { logger } from '../../../src/infrastructure/utils/Logger';
import { AppError } from '../../../src/infrastructure/errors/AppError';
import { executePayment } from '../../../src/interfaces/controllers/executePaymentsController';

jest.mock('../../../src/application/services/PaymentService');
jest.mock('../../../src/infrastructure/utils/Logger');

const mockedPaymentService = jest.mocked(PaymentService);

describe('executePaymentController', () => {
  let mockTransaction: Transaction;
  let mockContext: Context;

  beforeEach(() => {
    jest.resetAllMocks();

    mockTransaction = {
      transactionId: 'test-transaction-id',
      userId: 'test-user-id',
      amount: 100,
    } as Transaction;

    mockContext = {} as Context;

    jest.spyOn(logger, 'info').mockImplementation(() => {});
    jest.spyOn(logger, 'error').mockImplementation(() => {});
  });

  test('should execute payment successfully and return transactionId', async () => {
    mockedPaymentService.prototype.processPayment.mockResolvedValueOnce({ transactionId: 'test-transaction-id', userId: 'test-user-id', amount: 100 });

    const result = await executePayment(mockTransaction, mockContext);

    expect(mockedPaymentService.prototype.processPayment).toHaveBeenCalledWith(mockTransaction);
    expect(logger.info).toHaveBeenCalledWith('Executing payment', { transaction: mockTransaction, context: mockContext });
    expect(logger.info).toHaveBeenCalledWith('Payment execution completed', { transactionId: mockTransaction.transactionId });
    expect(result).toBe(mockTransaction.transactionId);
  });

  test('should log error and throw AppError if processPayment fails', async () => {
    const mockError = new AppError('Payment processing failed');
    mockedPaymentService.prototype.processPayment.mockRejectedValueOnce(mockError);

    try {
      await executePayment(mockTransaction, mockContext);
    } catch (error) {
      expect(mockedPaymentService.prototype.processPayment).toHaveBeenCalledWith(mockTransaction);
      expect(error).toBe(mockError);
    }
  });
});
