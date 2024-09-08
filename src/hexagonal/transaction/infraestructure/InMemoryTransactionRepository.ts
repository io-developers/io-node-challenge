import { Transaction } from "../domain/Transaction";
import { TransactionRepository } from "../domain/TransactionRepository";
import { TransactionIdVo } from "../domain/value-object/transaction-id.vo";

export class InMemoryTransactionRepository implements TransactionRepository {
  private transactionModel: Transaction[] = [];
  async getOneById(id: TransactionIdVo): Promise<Transaction | null> {
    return (
      this.transactionModel.find(
        (transaction) => transaction.id.value === id.value
      ) || null
    );
  }

  async create(transaction: Transaction): Promise<void> {
    this.transactionModel.push(transaction);
  }

  async update(transaction: Transaction): Promise<void> {
    const index = this.transactionModel.findIndex(
      (u) => u.id.value == transaction.id.value
    );
    this.transactionModel[index] = transaction;
  }
}
