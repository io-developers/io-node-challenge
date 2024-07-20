import { Module } from '@nestjs/common';
import { PaymentModule } from './payments/PaymentModule';

@Module({
  imports: [PaymentModule],
})
export class AppModule {}
