import { Transaction } from '../models/Transaction';

export interface IPaymentRepository {
  savePayment(payment: Transaction): Promise<boolean>;
}
