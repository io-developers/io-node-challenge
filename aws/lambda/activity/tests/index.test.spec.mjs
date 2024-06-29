import pkg from "aws-sdk";
import { handler } from "../index.mjs";
import { HTTP_CODES } from "../helpers/http/helpers-http.mjs";
import { EVENTS } from "../helpers/events/events-helpers.mjs";
import { TABLES } from "../helpers/tables/tables-helpers.mjs";
import { transactionMock } from "./mocks/dynamodb/transaction-mock.mjs";
import { regionMock } from "./mocks/aws/aws-mock.mjs";

// mock for aws-sdk
jest.mock("aws-sdk", () => {
  const mDocumentClient = {
    put: jest.fn().mockReturnThis(),
    promise: jest.fn().mockResolvedValue({})
  };
  return {
    DynamoDB: {
      DocumentClient: jest.fn(() => mDocumentClient),
      Converter: {
        unmarshall: jest.fn((item) => item)
      }
    },
    config: {
      update: jest.fn()
    }
  };
});

describe("handler", () => {
  let mockEvent;
  let consoleErrorSpy;

  // eslint-disable-next-line no-undef
  beforeAll(() => {
    pkg.config.update({ region: regionMock });
  });

  beforeEach(() => {
    mockEvent = {
      Records: [
        {
          eventName: EVENTS.INSERT,
          dynamodb: {
            NewImage: transactionMock
          }
        }
      ]
    };
    consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
    jest.clearAllMocks();
  });

  it("sould process an event INSERT", async () => {
    const response = await handler(mockEvent);
    expect(response.statusCode).toBe(HTTP_CODES.OK);
    expect(JSON.parse(response.body)).toBe(
      "Procesamiento completado con éxito"
    );

    expect(pkg.DynamoDB.DocumentClient().put).toHaveBeenCalledWith({
      TableName: TABLES.ACTIVITY,
      Item: expect.objectContaining({
        originalItemId: transactionMock.transactionId,
        eventType: EVENTS.INSERT
      })
    });
  });

  it("sould process an error correctly", async () => {
    pkg.DynamoDB.DocumentClient().put.mockImplementationOnce(() => ({
      promise: jest.fn().mockRejectedValue(new Error("DynamoDB error"))
    }));

    const response = await handler(mockEvent);
    expect(response.statusCode).toBe(HTTP_CODES.INTERNAL_SERVER_ERROR);
    expect(JSON.parse(response.body).error).toBe(
      "Error en el procesamiento: DynamoDB error"
    );
    expect(consoleErrorSpy).toHaveBeenCalled();
  });

  it("sohuld process an event with MODIFY", async () => {
    mockEvent.Records[0].eventName = EVENTS.MODIFY;
    const response = await handler(mockEvent);
    expect(response.statusCode).toBe(HTTP_CODES.OK);
    expect(JSON.parse(response.body)).toBe(
      "Procesamiento completado con éxito"
    );
  });

  it("sohuld process an event with REMOVE", async () => {
    mockEvent.Records[0].eventName = EVENTS.REMOVE;
    mockEvent.Records[0].dynamodb.OldImage =
      mockEvent.Records[0].dynamodb.NewImage;
    delete mockEvent.Records[0].dynamodb.NewImage;
    const response = await handler(mockEvent);
    expect(response.statusCode).toBe(HTTP_CODES.OK);
    expect(JSON.parse(response.body)).toBe(
      "Procesamiento completado con éxito"
    );
  });
});
