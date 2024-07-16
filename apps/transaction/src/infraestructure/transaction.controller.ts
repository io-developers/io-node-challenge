import { Controller, Get, Inject, Logger, NotFoundException, Param, ParseUUIDPipe, Query } from '@nestjs/common';
import { TransactionService } from '../aplication/transaction.service';

@Controller('transaction')
export class TransactionController {
  constructor(@Inject('TransactionService') private readonly transactionService: TransactionService, private readonly logger: Logger) {}

  @Get()
  async getTransaction(@Query('transactionId',  ParseUUIDPipe)  transactionId : string) {
    this.logger.log('Start to get Transaction', 'TransactionController - getTransaction');
    this.logger.log(`Payload : ${transactionId}`, 'TransactionController - getTransaction');
    try {
      const result = await this.transactionService.getTransaction(transactionId);
      if (!result) {
        this.logger.error(`Transaccion no encontrada`, 'TransactionController - getTransaction');
        throw new NotFoundException('Transaccion no encontrada');
      }
      return result;
    } catch (error) {
      this.logger.error(`Error Generico ${JSON.stringify(error)}`, 'TransactionController - getTransaction');
      throw error
    }
  }
}
