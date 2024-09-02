export class PaymentGatewayAdapter {
  async processPayment(userId: string, amount: number): Promise<{ success: boolean }> {

    // Simulate a call to an external payment gateway API
    return { success: true }; // Assume always successful for simplicity
  }
}
