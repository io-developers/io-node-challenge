import { Injectable } from "@nestjs/common";
import { Transaction } from "../../Domain/Entities/Transaction";
import { TransactionRepository } from "../../Domain/Ports/TransactionRepository";

@Injectable()
export class TransactionRepositoryImpl implements TransactionRepository {

  createTransaction(transaction: Transaction): Promise<Transaction> {
    // TODO: implementar
    return Promise.resolve(transaction);
  }
  getTransaction(transactionId: string): Promise<Transaction> {
    // TODO: implementar
    const transaction: Transaction = {
      transactionId: transactionId,
      userId: '123',
      amount: 100,
    };
    return Promise.resolve(transaction);
  }

}