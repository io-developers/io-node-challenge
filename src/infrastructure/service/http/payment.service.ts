import { Injectable } from '@nestjs/common';
import { PaymentService } from '@application/service/payment.service';
import { TransactionService } from '@application/service/transaction.service';
import { UserService } from '@application/service/user.service';

@Injectable()
export class PaymentServiceHttp implements PaymentService {
  constructor(
    private readonly _usersService: UserService,
    private readonly _transactionsService: TransactionService,
  ) {}

  async processPayment(userId: string, amount: number): Promise<string> {
    const userExists = await this._usersService.validateUser(userId);
    if (!userExists) {
      throw new Error('User not found');
    }

    return this._transactionsService.createTransaction(userId, amount);
  }
}
