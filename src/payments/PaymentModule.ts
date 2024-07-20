import { Module } from '@nestjs/common';
import { PaymentController } from './PaymentController';

@Module({
    controllers: [PaymentController],
})
export class PaymentModule {}