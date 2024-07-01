import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';
import { Transaction } from '../../../src/domain/entity/Transaction';
import { DynamoDBActivityRepository } from '../../../src/infrastructure/repository/DynamoDBActivityRepository';


jest.mock("@aws-sdk/lib-dynamodb");
jest.mock("@aws-sdk/client-dynamodb");

describe('DynamoDBActivityRepository', () => {
  let dynamoDBActivityRepository: DynamoDBActivityRepository;
  let mockSend: jest.Mock;

  beforeEach(() => {
    mockSend = jest.fn();
    (DynamoDBDocumentClient.from as jest.Mock).mockReturnValue({
      send: mockSend
    });
    dynamoDBActivityRepository = new DynamoDBActivityRepository();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should save activity to DynamoDB and return the transaction', async () => {
    const transaction = new Transaction('trans123', 'user456', '100');

    mockSend.mockResolvedValueOnce({});

    const result = await dynamoDBActivityRepository.saveActivity(transaction);

    expect(result).toEqual(transaction);
    expect(mockSend).toHaveBeenCalledTimes(1);
    expect(mockSend).toHaveBeenCalledWith(expect.any(PutCommand));
  });

  it('should throw an error if DynamoDB put operation fails', async () => {
    const transaction = new Transaction('trans123', 'user456', '100');

    mockSend.mockRejectedValueOnce(new Error('DynamoDB error'));

    await expect(dynamoDBActivityRepository.saveActivity(transaction)).rejects.toThrow('DynamoDB error');
    expect(mockSend).toHaveBeenCalledTimes(1);
    expect(mockSend).toHaveBeenCalledWith(expect.any(PutCommand));
  });
});
