import { Transaction } from "./Transaction";
import { TransactionIdVo } from "./value-object/transaction-id.vo";

export interface TransactionRepository {
  getOneById(id: TransactionIdVo): Promise<Transaction | null>;
  create(transaction: Transaction): Promise<void>;
  update(transaction: Transaction): Promise<void>;
}
