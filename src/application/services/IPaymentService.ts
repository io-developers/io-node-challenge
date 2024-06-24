import { Transaction } from '../../domain/models/Transaction';

export interface IPaymentService {
  processPayment(transaction:Transaction): Promise<Transaction>;
}
