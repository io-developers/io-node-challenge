import { Transaction } from "../domain/transaction.entity";

export interface IProcessService {
  processPayment(body: string | null): Transaction;
}
