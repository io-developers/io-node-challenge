import { handler } from "../index.mjs";
import { TABLE_TRANSACTIONS } from "../helpers/dynamo-helpers.mjs";
import { HTTP_CODES } from "../helpers/http/helpers-http.mjs";
import pkg from "aws-sdk";
import {
  transactionItem,
  transactionKeyObject,
  transactionsGetParams
} from "./mock/dynamodb-records.mjs";

// Mock de aws-sdk
jest.mock("aws-sdk", () => {
  const mDocumentClient = {
    get: jest.fn().mockReturnThis(),
    promise: jest.fn()
  };
  return {
    DynamoDB: {
      DocumentClient: jest.fn(() => mDocumentClient)
    }
  };
});

describe("Transaction Handler", () => {
  let mockDynamoDBGet;

  beforeEach(() => {
    jest.clearAllMocks();
    mockDynamoDBGet = pkg.DynamoDB.DocumentClient().get().promise;
    console.log = jest.fn();
    console.error = jest.fn();
  });

  it("should return transaction data when found", async () => {
    const mockEvent = {
      pathParameters: transactionsGetParams
    };
    const mockData = {
      Item: transactionItem
    };
    mockDynamoDBGet.mockResolvedValue(mockData);

    const result = await handler(mockEvent);

    expect(result.statusCode).toBe(HTTP_CODES.OK);
    expect(JSON.parse(result.body)).toEqual(mockData.Item);
    expect(pkg.DynamoDB.DocumentClient().get).toHaveBeenCalledWith({
      TableName: TABLE_TRANSACTIONS,
      Key: transactionKeyObject
    });
  });

  it("should return 404 when transaction is not found", async () => {
    const mockEvent = {
      pathParameters: transactionsGetParams
    };
    mockDynamoDBGet.mockResolvedValue({});

    const result = await handler(mockEvent);

    expect(result.statusCode).toBe(HTTP_CODES.NOT_FOUND);
    expect(JSON.parse(result.body)).toEqual({
      message: "Transaction not found"
    });
  });

  it("should handle DynamoDB errors", async () => {
    const mockEvent = {
      pathParameters: transactionsGetParams
    };
    mockDynamoDBGet.mockRejectedValue(new Error("DynamoDB error"));

    const result = await handler(mockEvent);

    expect(result.statusCode).toBe(HTTP_CODES.INTERNAL_SERVER_ERROR);
    expect(JSON.parse(result.body)).toEqual({
      message: "Error retrieving data from DynamoDB"
    });
    expect(console.error).toHaveBeenCalled();
  });
});
