import { Transaction } from "../entity/transaction";

export interface ITransactionRepository {
    getTransaction(transactionId: string): Promise<Transaction>;
}