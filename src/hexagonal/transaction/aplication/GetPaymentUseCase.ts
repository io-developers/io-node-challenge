import { Transaction } from "../domain/Transaction";
import { TransactionNotFoundError } from "../domain/TransactionNotFoundError";
import { TransactionRepository } from "../domain/TransactionRepository";
import { TransactionIdVo } from "../domain/value-object/transaction-id.vo";

export class GetPaymentUseCase {
  constructor(private repository: TransactionRepository) {}

  async execute(id: string): Promise<Transaction> {
    const transactionId = new TransactionIdVo(id);

    const exists = await this.repository.getOneById(transactionId);
    if (!exists) {
      throw new TransactionNotFoundError("Transacction not found");
    }
    return exists;
  }
}
