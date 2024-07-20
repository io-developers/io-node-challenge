import { Transaction } from "../Entities/Transaction";

export interface TransactionRepository {

    createTransaction(transaction: Transaction) : Promise<Transaction>;

    getTransaction(transactionId: string) : Promise<Transaction>;

}