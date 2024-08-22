import { TransactionClient } from "../../infrastructure/requester/transactionClient";
import { IPaymentService } from "../../domain/use-cases/payment.service";
import { Payment } from "../../domain/entities/payment.entity";
import { ITransactionClient } from "../../domain/requester/transactionclient";
import {ILogger} from "../../domain/interfaces/ILogger";

export class PaymentService implements IPaymentService {
  private readonly transactionClient: ITransactionClient;
  constructor(transactionClient: TransactionClient, private logger: ILogger) {
    this.transactionClient = transactionClient;
  }
  async executePayment(userId: string): Promise<Payment> {
    const transaction = await this.transactionClient.executeTransactionMock(userId);
    const payment: Payment = {
      userId: transaction.userId,
      transactionId: transaction.transactionId,
      status: "success"
    };
    this.logger.info(`[PaymentService][executePayment] success ${JSON.stringify(payment)}`);

    return payment;
  }
}

