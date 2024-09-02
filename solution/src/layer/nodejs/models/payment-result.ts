export interface PaymentResult {
  success: boolean;
  transactionId: string;
  accountId: string;
  amount: number;
}