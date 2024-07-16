import { Transaction } from "../domain/entity/transaction";
import { ITransactionRepository } from "../domain/repository/transaction.repository";

export class TransactionService {

  constructor( private readonly transactionRepository: ITransactionRepository ) {}

  async getTransaction(transactionId: string) {
    return this.transactionRepository.getTransaction(transactionId);
  }
}
