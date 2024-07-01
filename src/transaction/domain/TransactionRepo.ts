import { Transaction } from "./Transaction";

export abstract class TransactionRepository {
  abstract save(transaction: Transaction): Promise<void>;
  abstract getTransactionById(transactionId: string): Promise<Transaction>;
  abstract getTransactions(): Promise<Transaction[]>;
}