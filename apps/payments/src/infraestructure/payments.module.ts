import { Logger, Module, ValidationPipe } from '@nestjs/common';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from '../aplication/payments.service';
import { PaymentRepository } from './repository/payment.repository';
import { HttpModule } from '@nestjs/axios';
import { APP_PIPE } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    HttpModule,
    ConfigModule.forRoot({
      envFilePath: ['.env'],
    })
  ],
  controllers: [PaymentsController],
  providers: [
    Logger,
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
    {
      provide:'PaymentRepository',
      useClass: PaymentRepository
    },
    {
      provide: 'PaymentsService',
      useFactory: (repository: PaymentRepository) => new PaymentsService(repository),
      inject: ['PaymentRepository']
    }
  ],
})
export class PaymentsModule {}
