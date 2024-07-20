import { Inject, Injectable } from "@nestjs/common";
import { TransactionRepository } from "../Ports/TransactionRepository";
import { Transaction } from "../Entities/Transaction";
import { v4 as uuidv4 } from 'uuid';


@Injectable()
export class TransactionService {

  private readonly transactionRepository: TransactionRepository;

  constructor(
    @Inject('TransactionRepository')
    transactionRepository: TransactionRepository
  ) {
    this.transactionRepository = transactionRepository;
  }

  async createTransaction(transaction: Transaction): Promise<Transaction> {
    transaction.transactionId = uuidv4();
    return this.transactionRepository.createTransaction(transaction);
  }

  async getTransaction(transactionId: string): Promise<Transaction> {
    return this.transactionRepository.getTransaction(transactionId);
  }

}