import { PaymentService } from '@application/service/payment.service';
import { NotFoundException } from '@nestjs/common';

class MakePaymentParam {
  userId: string;
  amount: number;
}

export class SavePaymentTransactionUseCase {
  constructor(private readonly _paymentService: PaymentService) {}

  async execute({ userId, amount }: MakePaymentParam) {
    try {
      const transactionId = await this._paymentService.processPayment(
        userId,
        amount,
      );
      return {
        message: 'Payment registered successfully',
        transactionId,
      };
    } catch (error) {
      throw new NotFoundException('Something was wrong');
    }
  }
}
