export interface IValidationService {
  validatePaymentRequest(body: string | null): {
    transactionId: string;
    userId: string;
    amount: number;
  };
}
