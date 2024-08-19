import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from '@infrastructure/modules/user/user.module';
import { TransactionModule } from '@infrastructure/modules/transaction/transaction.module';
import { PaymentModule } from '@infrastructure/modules/payment/payment.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    UserModule,
    TransactionModule,
    PaymentModule,
  ],
})
export class AppModule {}
