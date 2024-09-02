import { PaymentResult } from "../../models/payment-result";

export interface PaymentGateway {
  processPayment(accountId: string, amount: number): Promise<PaymentResult>;
}