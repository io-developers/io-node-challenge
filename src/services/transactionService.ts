import { registerTransaction } from './registerTransaction';
import { updateAccount } from '../lambdas/updateAccount';
import { PaymentRequest } from '../models/PaymentRequest';

export class TransactionService {

  async handleTransaction(paymentRequest: PaymentRequest): Promise<string> {
    const transactionId = await this.createTransaction(paymentRequest);
    await this.updateAccountBalance(paymentRequest);
    return transactionId;
  }

  private async createTransaction(paymentRequest: PaymentRequest): Promise<string> {
    const transactionRecord = {
      source: paymentRequest.accountId,
      id: Date.now().toString(),
      data: {
        accountId: paymentRequest.accountId,
        amount: paymentRequest.amount,
      },
    };

    await registerTransaction(transactionRecord);

    return transactionRecord.source;
  }

  private async updateAccountBalance(paymentRequest: PaymentRequest): Promise<void> {
    await updateAccount(paymentRequest);
  }
}
