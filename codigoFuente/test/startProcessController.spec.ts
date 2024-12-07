import { APIGatewayProxyEvent } from "aws-lambda";
import { startProcess } from "../src/payments/infrastructure/controller/startProcessController";
import { uuid } from "uuidv4";
import { eventMockPayment } from "./mocks/events/eventMockPayment";
import { PaymentService } from "../src/payments/aplication/PaymentService";

jest.mock("../src/payments/aplication/PaymentService");

const mockedPaymentService = jest.mocked(PaymentService);

describe("startProcessController", () => {
  const userId = uuid();

  beforeEach(() => {
    jest.resetAllMocks();
  });

  test("event execute process to return successfully", async () => {
    mockedPaymentService.prototype.startProcess.mockResolvedValueOnce({
      state: true,
      message: "ok",
      transaction: { userId: userId, paymentAmount: 100 },
    });

    const result = await startProcess(
      eventMockPayment as unknown as APIGatewayProxyEvent
    );

    console.log(result);

    const parsedResult = JSON.parse(result.body);

    expect(parsedResult.data.state).toBeTruthy();
  });

  test("event execute process to failed", async () => {
    mockedPaymentService.prototype.startProcess.mockResolvedValueOnce({
      state: false,
      message: "ok",
      transaction: { userId: userId, paymentAmount: 100 },
    });

    const result = await startProcess(
      eventMockPayment as unknown as APIGatewayProxyEvent
    );

    console.log(result);

    const parsedResult = JSON.parse(result.body);

    expect(parsedResult.data.state).toBeFalsy();
  });
});
