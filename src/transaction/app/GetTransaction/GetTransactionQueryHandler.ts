import { QueryHandler } from "../../../shared/QueryHandler";
import { Result } from "../../../shared/Result";
import { Transaction } from "../../domain/Transaction";
import { TransactionNotFound } from "../../domain/TransactionNotFound";
import { TransactionRepository } from "../../domain/TransactionRepo";
import { GetTransactionQuery } from "./GetTransactionQuery";
import { Logger } from "../../../shared/Logger";

export class GetTransactionQueryHandler implements QueryHandler<Result<Transaction, TransactionNotFound>> {
  constructor(
    private transactionRepository: TransactionRepository
  ) {
    this.transactionRepository = transactionRepository;
  }

  async handle(query: GetTransactionQuery) {
    try {
      const transaction = await this.transactionRepository.getTransactionById(query.getTransactionId());

      return {
        ok: transaction,
        err: null
      }
    } catch (e) {
      if (e instanceof TransactionNotFound) {
        return {
          ok: null,
          err: new TransactionNotFound(query.getTransactionId())
        }
      }

      Logger.error(e);

      throw e;
    }
  }
}