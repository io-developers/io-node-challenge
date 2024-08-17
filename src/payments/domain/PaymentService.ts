import { Payment } from './Payment';
import { PaymentRepository } from './PaymentRepository';

export class PaymentService {
  private paymentRepository: PaymentRepository;

  constructor(paymentRepository: PaymentRepository) {
    this.paymentRepository = paymentRepository;
  }

  async registerPayment(payment: Payment): Promise<string> {
    if (!payment.userId || !payment.amount) {
      throw new Error('Invalid payment details');
    }
    await this.paymentRepository.save(payment);
    return payment.transactionId;
  }
}
