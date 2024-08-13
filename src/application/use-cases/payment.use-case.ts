import { PaymentProvider } from "../../infrastructure/externals/PaymentProvider";

export interface PaymentUseCase {
  createPayment(amount: number): Promise<any>;
}

export class PaymentUseCase implements PaymentUseCase {
  private paymentService: PaymentProvider;

  constructor(paymentService: PaymentProvider) {
    this.paymentService = paymentService;
  }

  async createPayment(amount: number): Promise<any> {
    return await this.paymentService.createPayment(amount);
  }
}
