import { Payment } from '../entities/payment.entity';

export interface IPaymentService {
  executePayment(userId: string): Promise<Payment>;
}
