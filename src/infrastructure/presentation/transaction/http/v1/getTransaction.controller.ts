import { GetTransactionUseCase } from '@application/usecases/transaction/getTransaction.usecase';
import {
  Controller,
  Get,
  Query,
  HttpCode,
  HttpStatus,
  Inject,
} from '@nestjs/common';

@Controller('v1/transactions')
export class GetTransactionController {
  constructor(
    @Inject('GetTransactionUseCase')
    private readonly _useCase: GetTransactionUseCase,
  ) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async getTransaction(@Query('transactionId') transactionId: string) {
    return await this._useCase.execute(transactionId);
  }
}
