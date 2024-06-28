import { handler, generateTrxId } from "../index.mjs";

jest.mock("../helpers/utils-helpers.mjs", () => ({
  CHARS_TO_GENERATE_ID: "abcdefghijklmnopqrstuvwxyz0123456789",
  SPLIT_CHAR: "-"
}));

describe("Payment Handler", () => {
  beforeEach(() => {
    jest.spyOn(console, "log").mockImplementation(() => {});
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should process a successful payment", async () => {
    const event = {
      userId: "user123",
      amount: 100,
      isActive: true
    };

    const result = await handler(event);

    expect(result.paymentSuccess).toBe(true);
    expect(result.userId).toBe("user123");
    expect(result.amount).toBe(100);
    expect(result.transactionId).toMatch(
      /^[a-z0-9]{8}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{12}$/
    );
  });

  it("should reject payment for inactive user", async () => {
    const event = {
      userId: "user123",
      amount: 100,
      isActive: false
    };

    const result = await handler(event);

    expect(result.paymentSuccess).toBe(false);
    expect(result.error).toBe(
      "Transacción desnegada por inactividad de usuario"
    );
  });

  it("should handle unexpected errors", async () => {
    const event = {};

    const result = await handler(event);

    expect(result.paymentSuccess).toBe(false);
    expect(result.error).toBeDefined();
  });
});

describe("generateTrxId", () => {
  it("should generate a transaction ID with correct format", () => {
    const trxId = generateTrxId();
    expect(trxId).toMatch(
      /^[a-z0-9]{8}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{12}$/
    );
  });

  it("should generate unique transaction IDs", () => {
    const trxId1 = generateTrxId();
    const trxId2 = generateTrxId();
    expect(trxId1).not.toBe(trxId2);
  });
});
