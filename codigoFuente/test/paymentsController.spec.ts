import { Context } from "aws-lambda";
import { Transaction } from "../src/payments/domain/entitys/transaction.entity";
import { paymentTransaction } from "../src/payments/infrastructure/controller/paymentsController";
import { uuid } from "uuidv4";
import { PaymentService } from "../src/payments/aplication/PaymentService";

jest.mock("../src/payments/aplication/PaymentService");

const mockedPaymentService = jest.mocked(PaymentService);

describe("paymentsController", () => {
  let mockTransaction: Transaction;
  let mockContext: Context;
  const userId = uuid();

  beforeEach(() => {
    jest.resetAllMocks();

    mockTransaction = {
      userId: userId,
      paymentAmount: 100,
    };

    mockContext = {} as Context;
  });

  test("evento process to return successfully", async () => {
    mockedPaymentService.prototype.processPaymentTransaction.mockResolvedValueOnce(
      { userId: userId, paymentAmount: 100 }
    );

    const result = await paymentTransaction(mockTransaction, mockContext);

    console.log(result);

    expect(result.userId).toBe(mockTransaction.userId);
    expect(result.paymentAmount).toBe(mockTransaction.paymentAmount);
  });
});
