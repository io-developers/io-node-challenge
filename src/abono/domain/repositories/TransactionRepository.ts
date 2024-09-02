import { Transaction } from "../entities/Transaction";

export interface TransactionRepository {
  save(transaction: Transaction): Promise<void>;
  update(transaction: Transaction): Promise<void>;
  findById(id: string): Promise<Transaction | null>;
}
