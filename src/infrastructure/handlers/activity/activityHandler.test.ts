
import AWS from "aws-sdk";
import { handler } from "./activityHandler";

// Mock the AWS SDK
jest.mock("aws-sdk", () => {
  const DocumentClient = {
    put: jest.fn().mockReturnThis(),
    promise: jest.fn(),
  };
  return {
    DynamoDB: {
      DocumentClient: jest.fn(() => DocumentClient),
      Converter: {
        unmarshall: jest.fn().mockReturnValue({
          transactionId: "1234-5678",
        }),
      },
    },
    util: {
      uuid: {
        v4: jest.fn().mockReturnValue("unique-uuid"),
      },
    },
  };
});

describe("activityHandler", () => {
  it("should log a new activity when an INSERT event is received", async () => {
    const mockEvent: any = {
      Records: [
        {
          eventID: "1",
          eventName: "INSERT",
          eventVersion: "1.0",
          eventSource: "aws:dynamodb",
          awsRegion: "us-east-1",
          dynamodb: {
            Keys: {
              transactionId: { S: "1234-5678" },
            },
            NewImage: {
              transactionId: { S: "1234-5678" },
            },
            StreamViewType: "NEW_IMAGE",
          },
        },
      ],
    };

    const mockContext: any = {} as any;
    const mockCallback: any = jest.fn();

    await handler(mockEvent, mockContext, mockCallback);

    expect(new AWS.DynamoDB.DocumentClient().put).toHaveBeenCalledWith({
      TableName: "activity",
      Item: {
        activityId: "unique-uuid",
        transactionId: "1234-5678",
        action: "INSERT",
        date: expect.any(String),
      },
    });
    expect(mockCallback).toHaveBeenCalledWith(
      null,
      "Successfully processed 1 records."
    );
  });
});
