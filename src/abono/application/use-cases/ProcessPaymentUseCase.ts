import {TransactionRepository} from "../../domain/repositories/TransactionRepository";
import {Transaction} from "../../domain/entities/Transaction";
import {PaymentGatewayAdapter} from "../../infrastructure/adapters/PaymentGatewayAdapter";
import {v4 as uuidv4} from 'uuid';

export class ProcessPaymentUseCase {
  constructor(
      private transactionRepository: TransactionRepository,
      private paymentGateway: PaymentGatewayAdapter
  ) {
  }

  async execute(userId: string, amount: number): Promise<Transaction> {
    const transaction = new Transaction(
        uuidv4(),
        userId,
        amount,
        'payment',
        'pending',
        new Date()
    );

    await this.transactionRepository.save(transaction);

    const paymentResult = await this.paymentGateway.processPayment(userId, amount);

    transaction.status = paymentResult.success ? 'successful' : 'failed';
    await this.transactionRepository.update(transaction);

    return transaction;
  }
}
