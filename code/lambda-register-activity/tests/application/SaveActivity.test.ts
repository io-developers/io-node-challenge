import { SaveActivity } from '../../src/application/saveActivity';
import { DynamoDBActivityRepository } from '../../src/infrastructure/repository/DynamoDBActivityRepository';
import { Transaction } from '../../src/domain/entity/Transaction';


jest.mock('../../src/infrastructure/repository/DynamoDBActivityRepository');

const mockDynamoDBActivityRepository = DynamoDBActivityRepository as jest.MockedClass<typeof DynamoDBActivityRepository>;

describe('SaveActivity', () => {
  let saveActivity: SaveActivity;

  beforeEach(() => {
    saveActivity = new SaveActivity();
  });

  it('should return a transaction if found', async () => {
    const mockTransaction: Transaction = { transactionId: '123', userId: "1234", paymentAmount: "100"};
    mockDynamoDBActivityRepository.prototype.saveActivity.mockResolvedValueOnce(mockTransaction);

    const result = await saveActivity.execute(mockTransaction);

    expect(result).toEqual(mockTransaction);
    expect(mockDynamoDBActivityRepository.prototype.saveActivity).toHaveBeenCalledWith(mockTransaction);
  });

});
