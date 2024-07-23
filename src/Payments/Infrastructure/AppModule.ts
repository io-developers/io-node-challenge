import { Module } from '@nestjs/common';
import { PaymentModule } from './PaymentModule';

@Module({
    imports: [PaymentModule],
})
export class AppModule {}