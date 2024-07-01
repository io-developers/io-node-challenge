
import { DynamoDBDocumentClient, GetCommand, GetCommandOutput } from '@aws-sdk/lib-dynamodb';
import { Transaction } from '../../../src/domain/entity/Transaction';
import { DynamoDBTransactionRepository } from '../../../src/infrastructure/repository/DynamoDBTransactionRepository';


jest.mock('@aws-sdk/lib-dynamodb', () => {
  const originalModule = jest.requireActual('@aws-sdk/lib-dynamodb');
  return {
    ...originalModule,
    DynamoDBDocumentClient: {
      from: jest.fn(),
    },
    GetCommand: jest.fn(),
  };
});

describe('DynamoDBTransactionRepository', () => {
  let repository: DynamoDBTransactionRepository;

  type MockDynamoDBDocumentClient = {
    send: jest.MockedFunction<(command: GetCommand) => Promise<GetCommandOutput>>;
  };

  let mockDbClient: MockDynamoDBDocumentClient;

  beforeEach(() => {
    mockDbClient = {
      send: jest.fn(),
    };
    (DynamoDBDocumentClient.from as jest.Mock).mockReturnValue(mockDbClient);
    repository = new DynamoDBTransactionRepository();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return a transaction if found', async () => {
    const transactionId = '123';
    const mockTransaction = { transactionId: '123', userId: 'user1', paymentAmount: '100' };
    const mockOutput: GetCommandOutput = {
      Item: mockTransaction,
      $metadata: {
        httpStatusCode: 200,
        requestId: 'fakeRequestId',
        extendedRequestId: 'fakeExtendedRequestId',
        cfId: 'fakeCfId',
        attempts: 1,
        totalRetryDelay: 0
      }
    };

    mockDbClient.send.mockResolvedValue(mockOutput);

    const result = await repository.getTransactionById(transactionId);

    expect(result).toEqual(new Transaction('123', 'user1', '100'));
    expect(mockDbClient.send).toHaveBeenCalledWith(expect.any(GetCommand));
  });

  it('should return null if transaction is not found', async () => {
    const transactionId = '123';
    const mockOutput: GetCommandOutput = {
      Item: undefined,
      $metadata: {
        httpStatusCode: 200,
        requestId: 'fakeRequestId',
        extendedRequestId: 'fakeExtendedRequestId',
        cfId: 'fakeCfId',
        attempts: 1,
        totalRetryDelay: 0
      }
    };

    mockDbClient.send.mockResolvedValue(mockOutput);

    const result = await repository.getTransactionById(transactionId);

    expect(result).toBeNull();
    expect(mockDbClient.send).toHaveBeenCalledWith(expect.any(GetCommand));
  });
});
