import { PaymentApi } from '../../../src/infrastructure/httpclient/PaymentApi/PaymentApi';
import { Transaction } from '../../../src/domain/entity/Transaction';
import { IPaymentApi } from '../../../src/domain/api/IPaymentApi';

describe('PaymentApi', () => {
  let paymentApi: IPaymentApi;

  beforeEach(() => {
    paymentApi = new PaymentApi();
  });

  it('should create a payment and return the transaction', async () => {
    const transaction = new Transaction('1', 'user-1', '100');

    const result = await paymentApi.createPayment(transaction);

    expect(result).toEqual(transaction);
    expect(result?.transactionId).toBe('1');
    expect(result?.userId).toBe('user-1');
    expect(result?.amount).toBe('100');
  });

});
