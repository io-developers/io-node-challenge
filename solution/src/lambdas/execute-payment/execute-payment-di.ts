import { ExecutePaymentUseCase } from "./execute-payment-use-case";
import { MockPaymentGateway } from "/opt/nodejs/services/payment-gateway/mock-payment-gateway";
import { PaymentGateway } from "/opt/nodejs/services/payment-gateway/payment-gateway";

export class ExecutePaymemtDependencyInjectionContainer {
  private paymentService: PaymentGateway;
  public executePaymentUseCase: ExecutePaymentUseCase;
  
  constructor() {
    this.paymentService = new MockPaymentGateway();
    this.executePaymentUseCase = new ExecutePaymentUseCase(this.paymentService)
  }
}