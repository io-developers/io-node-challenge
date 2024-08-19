export interface PaymentService {
  processPayment(userId: string, amount: number): Promise<string>;
}
