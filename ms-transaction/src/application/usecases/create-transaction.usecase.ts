import { inject, injectable } from "inversify";
import { TransactionRepository } from "../../domain/repository/transaction.repository";
import { TYPES } from "../../infraestructure/containers/inversify.constant";
import { CreatedTransactionResDto } from "../dtos/response/created-transaction.res.dto";
import { Transaction } from "../../domain/interface/transaction.interface";
import { Logger } from "@aws-lambda-powertools/logger";
import { CreateTransactionReqDto } from "../dtos/request/create-transaction.req.dto";

const logger = new Logger({ serviceName: 'CreateTransactionUsecase' });

@injectable()
export class CreateTransactionUsecase {
  constructor(
    @inject(TYPES.TransactionRepository) private transactionRepository: TransactionRepository
  ) { }

  async execute(dto: CreateTransactionReqDto): Promise<CreatedTransactionResDto> {
    try {
      const transaction: Transaction = { id: dto.transactionCode, data: { accountId: dto.accountId, amount: dto.amount } };
      const transactionCreated = await this.transactionRepository.createTransaction(transaction);
      return new CreatedTransactionResDto({ transactionId: transactionCreated.source || ''});
    } catch (error) {
      logger.error(`Error creating transaction ${error}`);
      return new CreatedTransactionResDto({});
    }

  }
}