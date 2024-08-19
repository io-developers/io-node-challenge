import { TransactionService } from '@application/service/transaction.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';

export class GetTransactionUseCase {
  constructor(private readonly _transactionsService: TransactionService) {}

  async execute(transactionId: string) {
    if (!transactionId) {
      throw new BadRequestException('transactionId is required');
    }

    const transaction =
      await this._transactionsService.getTransaction(transactionId);

    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }

    return transaction;
  }
}
