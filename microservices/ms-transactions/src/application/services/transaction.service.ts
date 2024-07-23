import { ILogger } from "../../domain/interfaces/ILogger";
import { Transaction } from "../../domain/entities/transaction.entity";
import { ITransactionRepository } from "../../domain/use-cases/transaction.repository";
import { ITransactionService } from "../../domain/use-cases/transaction.service";

export class TransactionService implements ITransactionService {

  constructor(private transactionRepository: ITransactionRepository, private logger: ILogger) { }

  async findById(transactionId: string): Promise<Transaction | null> {

    const rowTransaction = await this.transactionRepository.findById(transactionId);

    this.logger.info(`[TransactionService][findById] rowTransaction: ${rowTransaction}`);

    return rowTransaction;
  }

}
