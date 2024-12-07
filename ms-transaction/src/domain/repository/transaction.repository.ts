import { Transaction } from "../interface/transaction.interface";

export interface TransactionRepository {
    createTransaction(dataTransaction: Transaction): Promise<Transaction>;
}