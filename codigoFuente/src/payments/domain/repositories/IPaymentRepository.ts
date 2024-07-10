import { Transaction } from "../entitys/transaction.entity";

export interface IPaymentRepository {
  savePayment(payment: Transaction): Promise<boolean>;
}
