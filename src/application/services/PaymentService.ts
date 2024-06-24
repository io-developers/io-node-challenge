import { IPaymentService } from './IPaymentService';
import { IPaymentRepository } from '../../domain/repositories/IPaymentRepository';
import { generateId } from '../../infrastructure/utils';
import { Transaction } from '../../domain/models/Transaction';
import { TransactionRepository } from '../../domain/repositories/TransactionRepository';

export class PaymentService implements IPaymentService {
  constructor(private paymentRepository: IPaymentRepository, private transactionRepository: TransactionRepository) {}

  async processPayment(transaction:Transaction): Promise<Transaction> {
    await this.paymentRepository.savePayment(transaction);
    await this.transactionRepository.saveTransaction(transaction);
    return transaction;
  }
}
