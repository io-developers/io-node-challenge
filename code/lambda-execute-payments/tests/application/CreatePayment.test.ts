import { CreatePayment } from '../../src/application/createPayment';
import { PaymentApi } from '../../src/infrastructure/httpclient/PaymentApi/PaymentApi';
import { Transaction } from '../../src/domain/entity/Transaction';

jest.mock('../../src/infrastructure/httpclient/PaymentApi/PaymentApi');

const mockPaymentApi = PaymentApi as jest.MockedClass<typeof PaymentApi>;

describe('PaymentApi', () => {
  let createPayment: CreatePayment;

  beforeEach(() => {
    createPayment = new CreatePayment();
  });

  it('should return a transaction if found', async () => {
    const mockTransaction: Transaction = { transactionId: '123', userId: "1234", amount: "100"};
    mockPaymentApi.prototype.createPayment.mockResolvedValueOnce(mockTransaction);

    const result = await createPayment.execute(mockTransaction);

    expect(result).toEqual(mockTransaction);
    expect(mockPaymentApi.prototype.createPayment).toHaveBeenCalledWith(mockTransaction);
  });

  it('should return null if transaction is not found', async () => {

    const mockTransaction: Transaction = { transactionId: '123', userId: "1234", amount: "100"};
    mockPaymentApi.prototype.createPayment.mockResolvedValueOnce(null);

    const result = await createPayment.execute(mockTransaction);

    expect(result).toBeNull();
    expect(mockPaymentApi.prototype.createPayment).toHaveBeenCalledWith(mockTransaction);
  });
});
