import { Transaction } from "../domain/Transaction";
import { TransactionRepository } from "../domain/TransactionRepository";
import { TransactionDataVo } from "../domain/value-object/transaction-data.vo";
import { TransactionIdVo } from "../domain/value-object/transaction-id.vo";
import { TransactionSourceVo } from "../domain/value-object/transaction-source.vo";

export class ExecutePaymentUseCase {
  constructor(private repository: TransactionRepository) {}

  async execute(
    source: string,
    id: string,
    data: { accountId: string; amount: number }
  ): Promise<void> {
    const transaction = new Transaction(
      new TransactionSourceVo(source),
      new TransactionIdVo(id),
      new TransactionDataVo(data.accountId, data.amount)
    );
    return await this.repository.create(transaction);
  }
}
