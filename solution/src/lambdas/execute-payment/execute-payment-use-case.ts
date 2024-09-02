import { PaymentGateway } from "/opt/nodejs/services/payment-gateway/payment-gateway";

export class ExecutePaymentUseCase {
  
  constructor(private readonly paymentService: PaymentGateway) {}

  async executePayment(accountId: string, amount: number): Promise<string> {
    const paymentResult = await this.paymentService.processPayment(accountId, amount);
      if (!paymentResult.success) {
        throw new Error("Could not process payment")
      }

      return paymentResult.transactionId
  }
}