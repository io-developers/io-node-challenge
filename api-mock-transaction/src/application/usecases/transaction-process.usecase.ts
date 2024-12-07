import { Logger } from "@aws-lambda-powertools/logger";
import { ProcessedTransactionDto } from "../dtos/response/processed-transaction.dto";

const logger = new Logger({ serviceName: 'TransactionProcessUsecase' });

export class TransactionProcessUsecase {


  async execute(amount: number): Promise<ProcessedTransactionDto> {
    const isSuccess = Math.random() < 0.8; // 80% de probabilidad de éxito

    if (isSuccess) {
      const transactionCode = Math.floor(Math.random() * 100000) + 1;
      const processedTransaction = {
        transactionCode,
        amount,
        status: 'SUCCESS',
        message: 'Transaction processed successfully'
      } as ProcessedTransactionDto;
      logger.info('Transaction processed successfully', { amount });
      return processedTransaction;
    } else {
      logger.error('Transaction failed', { amount });
      const processedTransaction = {
        transactionCode: 0,
        status: 'FAILURE',
        message: 'Transaction failed'
      } as ProcessedTransactionDto;
      return processedTransaction;
    }
  }
}