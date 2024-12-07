import { TransactionDTO } from "../dto/transaction.dto";
import { Transaction } from "../entitys/transaction.entity";

export interface ITransactionRepository {
  saveTransaction(transaction: Transaction): Promise<TransactionDTO>;
}
