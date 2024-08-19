import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { PaymentServiceHttp } from '@infrastructure/service/http/payment.service';
import { PaymentsController } from '@infrastructure/presentation/payment/http/v1/payment.controller';
import { UserModule } from '@infrastructure/modules/user/user.module';
import { TransactionModule } from '@infrastructure/modules/transaction/transaction.module';
import { SavePaymentTransactionUseCase } from '@application/usecases/payment/savePaymentTransaction.usecase';
import { PaymentService } from '@application/service/payment.service';
import { UserServiceHttp } from '@infrastructure/service/http/user.service';
import { UserService } from '@application/service/user.service';
import { TransactionService } from '@application/service/transaction.service';
import { TransactionServiceHttp } from '@infrastructure/service/http/transaction.service';

@Module({
  imports: [UserModule, TransactionModule, HttpModule],
  controllers: [PaymentsController],
  providers: [
    {
      provide: PaymentServiceHttp,
      inject: [UserServiceHttp, TransactionServiceHttp],
      useFactory: (
        userService: UserService,
        transactionService: TransactionService,
      ) => {
        return new PaymentServiceHttp(userService, transactionService);
      },
    },
    {
      provide: 'SavePaymentTransactionUseCase',
      inject: [PaymentServiceHttp],
      useFactory: (paymentService: PaymentService) => {
        return new SavePaymentTransactionUseCase(paymentService);
      },
    },
  ],
})
export class PaymentModule {}
