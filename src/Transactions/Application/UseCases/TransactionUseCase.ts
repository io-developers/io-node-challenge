import { Injectable } from "@nestjs/common";
import { TransactionService } from "../../Domain/Services/TransactionService";
import { TransactionRequestDTO } from "../DTOs/TransactionRequestDTO";
import { TransactionResponseDTO } from "../DTOs/TransactionResponseDTO";
import { Transaction } from "../../Domain/Entities/Transaction";

@Injectable()
export class TransactionUseCase {

  private readonly transactionService: TransactionService

  constructor(transactionService: TransactionService) {
    this.transactionService = transactionService;
  }

  async createTransaction(transactionRequest: TransactionRequestDTO): Promise<TransactionResponseDTO> {
    const transaction: Transaction = {
      userId: transactionRequest.userId,
      amount: transactionRequest.amount
    }
    const transactionCreate = await this.transactionService.createTransaction(transaction);
    return transactionCreate as TransactionResponseDTO;
  }

  async getTransaction(transactionId: string): Promise<TransactionResponseDTO | { message: string}> {
    console.log('-- TransactionUseCase.getTransaction --');
    const transaction = await this.transactionService.getTransaction(transactionId);
    if (transaction === null) {
      return { message: 'Transaction not found' };
    }
    return transaction as TransactionResponseDTO;
  }
}