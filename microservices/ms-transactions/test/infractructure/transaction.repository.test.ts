import { DocumentClient } from "aws-sdk/clients/dynamodb";
import { Transaction } from "../../src/domain/entities/transaction.entity";
import { ILogger } from "../../src/domain/interfaces/ILogger";
import { DynamoDBTransactionRepository } from "../../src/infrastructure/repository/transaction.repository";

jest.mock("aws-sdk/clients/dynamodb", () => {
  return {
    DocumentClient: jest.fn(() => ({
      get: jest.fn().mockReturnThis(),
      promise: jest.fn(),
    })),
  };
});

describe("infrastructura.transaction.repository.test", () => {
  let documentClient: jest.Mocked<DocumentClient>;
  let logger: ILogger;
  let repository: DynamoDBTransactionRepository;

  beforeEach(() => {
    documentClient = new DocumentClient() as jest.Mocked<DocumentClient>;
    logger = { info: jest.fn() } as unknown as ILogger;
    repository = new DynamoDBTransactionRepository(documentClient, logger);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return a transaction if found", async () => {
    const transactionId = "123";
    const transaction: Transaction = { transactionId, userId: "user1", amount: 100 };

    (documentClient.get as jest.Mock).mockReturnValue({
      promise: jest.fn().mockResolvedValueOnce({ Item: transaction }),
    });

    const result = await repository.findById(transactionId);

    expect(result).toEqual(transaction);
  });


  it("should return null if transaction not found", async () => {
    const transactionId = "123";

    (documentClient.get as jest.Mock).mockReturnValue({
      promise: jest.fn().mockResolvedValueOnce({}),
    });

    const result = await repository.findById(transactionId);

    expect(result).toBeNull();
    expect(logger.info).toHaveBeenCalledWith(expect.stringContaining(`Transaction ${transactionId} not found`));
  });

  it("should log an error if DynamoDB get fails", async () => {
    const transactionId = "123";
    const errorMessage = "DynamoDB error";

    (documentClient.get as jest.Mock).mockReturnValue({
      promise: jest.fn().mockRejectedValueOnce(new Error(errorMessage)),
    });

    await expect(repository.findById(transactionId)).rejects.toThrow("DynamoDB error");

  });

});
