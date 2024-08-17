import { Payment } from '../domain/Payment';
import { PaymentService } from '../domain/PaymentService';

export class CreatePaymentUseCase {
  private paymentService: PaymentService;

  constructor(paymentService: PaymentService) {
    this.paymentService = paymentService;
  }

  async execute(payment: Payment): Promise<string> {
    return this.paymentService.registerPayment(payment);
  }
}
