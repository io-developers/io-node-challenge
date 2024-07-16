import { Logger, Module, ValidationPipe } from '@nestjs/common';
import { MocksController } from './mocks.controller';
import { MocksService } from '../aplication/mocks.service';
import { PaymentRepository } from './repository/payment.repository.imp';
import { APP_PIPE } from '@nestjs/core';

@Module({
  imports: [],
  controllers: [MocksController],
  providers: [
    Logger,
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
    {
      provide: 'PaymentRepository',
      useClass: PaymentRepository
    },
    {
      provide: 'MocksService',
      useFactory: (paymentRepository: PaymentRepository) => new MocksService(paymentRepository),
      inject: ['PaymentRepository'],
    }
  ],
})
export class MocksModule {}
