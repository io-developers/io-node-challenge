import { APIGatewayProxyEvent } from "aws-lambda";

import { eventMockPayment } from "./mocks/events/eventMockPayment";
import mocked = jest.mocked;
import { Transaction } from "../src/mockPayments/domain/transaction.entity";
import { BadRequestError } from "../src/helper/utils/BadRequestError";
import { processPayment } from "../src/mockPayments/infrastructure/mockPaymentController";
import { ProcessService } from "../src/mockPayments/aplication/ProcessService";

jest.mock("../src/mockPayments/aplication/ProcessService");

describe("mockPaymentController", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  test("When mockPayment is succesfully", async () => {
    mocked(ProcessService.prototype.processPayment).mockReturnValue({
      userId: "userId",
      paymentAmount: 200,
    });

    const result = await processPayment(
      eventMockPayment as APIGatewayProxyEvent
    );

    expect(result).toEqual({
      statusCode: 200,
      body: '{"data":{"userId":"userId","paymentAmount":200}}',
    });
  });

  test("When event doesnt have body request", async () => {
    mocked(ProcessService.prototype.processPayment).mockReturnValue(
      {} as Transaction
    );
    const mockError = new BadRequestError(`Request body is required`);
    try {
      await processPayment({} as APIGatewayProxyEvent);
    } catch (error) {
      expect(error).toEqual(mockError);
    }
  });

  test("When event doesnt have standard body", async () => {
    mocked(ProcessService.prototype.processPayment).mockReturnValue(
      {} as Transaction
    );
    const mockError = new BadRequestError(`Invalid payment request"`);
    try {
      await processPayment({
        body: JSON.stringify({
          name: "f529177d-0521-414e-acd9-6ac840549e97",
        }),
      } as APIGatewayProxyEvent);
    } catch (error) {
      expect(error).toEqual(mockError);
    }
  });
});
