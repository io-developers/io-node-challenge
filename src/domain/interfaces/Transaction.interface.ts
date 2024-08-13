import { Transaction } from "../models/Transaction";

export interface ITransaction {
  create(userId: string, amount: number): Transaction;
  get(transactionId: string): Transaction;
}
