import { Transaction } from "../domain/entitys/transaction.entity";

export interface IPaymentService {
  processPaymentTransaction(transaction: Transaction): Promise<Transaction>;
  startProcess(
    transaction: Transaction
  ): Promise<{ state: boolean; message: string; transaction: Transaction }>;
}
