import { GetTransactionById } from '../../src/application/getTransactionById';
import { DynamoDBTransactionRepository } from '../../src/infrastructure/repository/DynamoDBTransactionRepository';
import { Transaction } from '../../src/domain/entity/Transaction';


jest.mock('../../src/infrastructure/repository/DynamoDBTransactionRepository');

const mockDynamoDBTransactionRepository = DynamoDBTransactionRepository as jest.MockedClass<typeof DynamoDBTransactionRepository>;

describe('GetTransactionById', () => {
  let getTransactionById: GetTransactionById;
  let transactionId: string;

  beforeEach(() => {
    transactionId = '123';
    getTransactionById = new GetTransactionById();
  });

  it('should return a transaction if found', async () => {
    const mockTransaction: Transaction = { transactionId: '123', userId: "1234", paymentAmount: "100"};
    mockDynamoDBTransactionRepository.prototype.getTransactionById.mockResolvedValueOnce(mockTransaction);

    const result = await getTransactionById.execute(transactionId);

    expect(result).toEqual(mockTransaction);
    expect(mockDynamoDBTransactionRepository.prototype.getTransactionById).toHaveBeenCalledWith(transactionId);
  });

  it('should return null if transaction is not found', async () => {
    mockDynamoDBTransactionRepository.prototype.getTransactionById.mockResolvedValueOnce(null);

    const result = await getTransactionById.execute(transactionId);

    expect(result).toBeNull();
    expect(mockDynamoDBTransactionRepository.prototype.getTransactionById).toHaveBeenCalledWith(transactionId);
  });
});
