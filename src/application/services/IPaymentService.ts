import { Transaction } from '../../domain/models/Transaction';

export interface IPaymentService {
  processPayment(transaction: Transaction): Promise<Transaction>;
  startPaymentProcess(
    userId: string,
    amount: number,
  ): Promise<{ message: string; transactionId: string }>;
}
