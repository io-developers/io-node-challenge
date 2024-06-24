import { Context } from 'aws-lambda';
import { PaymentService } from '../../application/services/PaymentService';
import { PaymentRepository } from '../../domain/repositories/PaymentRepository';
import { Transaction } from '../../domain/models/Transaction';
import { TransactionRepository } from '../../domain/repositories/TransactionRepository';

const paymentRepository = new PaymentRepository();
const transactionRepository = new TransactionRepository();
const paymentService = new PaymentService(paymentRepository,transactionRepository);

export const executePayment = async (transaction: Transaction, context: Context) => {
  const payment = await paymentService.processPayment(transaction);
  return transaction.transactionId;
};
