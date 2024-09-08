import { Transaction } from "./Transaction";

export interface TransactionRepository {
  getOneById(id: string): Promise<Transaction>;
  create(transaction: Transaction): Promise<void>;
  update(transaction: Transaction): Promise<void>;
}
