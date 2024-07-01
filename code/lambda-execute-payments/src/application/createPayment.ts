import { PaymentApi } from '../infrastructure/httpclient/PaymentApi/PaymentApi';
import { Transaction } from '../domain/entity/Transaction';

export class CreatePayment {
  private paymentApi: PaymentApi;

  constructor() {
    this.paymentApi = new PaymentApi();
  }

  async execute(transaction: Transaction): Promise<Transaction | null> {
    return await this.paymentApi.createPayment(transaction);
  }
}
