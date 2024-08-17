import { Transaction } from '../domain/Transaction';
import { TransactionRepository } from '../domain/TransactionRepository';
import { TransactionService } from '../domain/TransactionService';

describe('TransactionService', () => {
  let transactionService: TransactionService;
  let mockTransactionRepository: jest.Mocked<TransactionRepository>;

  beforeEach(() => {
    mockTransactionRepository = {
      get: jest.fn(),
    } as unknown as jest.Mocked<TransactionRepository>;

    transactionService = new TransactionService(mockTransactionRepository);
  });

  it('should retrieve a transaction successfully', async () => {
    const transactionId = '8db0a6fc-ad42-4974-ac1f-36bb90730afe';
    const transaction = new Transaction(
      transactionId,
      'f529177d-0521-414e-acd9-6ac840549e97',
      30,
    );

    (mockTransactionRepository.get as jest.Mock).mockResolvedValueOnce(
      transaction,
    );

    const result = await transactionService.getTransaction(transactionId);

    expect(result).toEqual(transaction);
    expect(mockTransactionRepository.get).toHaveBeenCalledWith(transactionId);
  });

  it('should return null if transaction is not found', async () => {
    const transactionId = '8db0a6fc-ad42-4974-ac1f-36bb90730afe';

    (mockTransactionRepository.get as jest.Mock).mockResolvedValueOnce(null);

    const result = await transactionService.getTransaction(transactionId);

    expect(result).toBeNull();
    expect(mockTransactionRepository.get).toHaveBeenCalledWith(transactionId);
  });
});
