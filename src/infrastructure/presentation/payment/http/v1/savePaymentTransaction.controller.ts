import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Inject,
} from '@nestjs/common';
import { SavePaymentTransactionUseCase } from '@application/usecases/payment/savePaymentTransaction.usecase';

@Controller('v1/payments')
export class SavePaymentTransactionController {
  constructor(
    @Inject('SavePaymentTransactionUseCase')
    private readonly _useCase: SavePaymentTransactionUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async makePayment(@Body() body: { userId: string; amount: number }) {
    const { userId, amount } = body;
    return await this._useCase.execute({ userId, amount });
  }
}
