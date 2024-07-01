
import { Transaction } from '../entity/Transaction';

export interface IPaymentApi {
  createPayment(transaction: Transaction): Promise<Transaction | null>;
}

