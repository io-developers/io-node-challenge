import { Logger, Module, ValidationPipe } from '@nestjs/common';
import { TransactionController } from './transaction.controller';
import { TransactionService } from '../aplication/transaction.service';
import { TransactionRepository } from './repository/transaction.repository.imp';
import { ConfigModule } from '@nestjs/config';
import { APP_PIPE } from '@nestjs/core';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env'],
    })
  ],
  controllers: [TransactionController],
  providers: [
    Logger,
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
    {
      provide: 'TransactionRepository',
      useClass: TransactionRepository
    },
    {
      provide: 'TransactionService',
      useFactory: (repository: TransactionRepository) => new TransactionService(repository),
      inject: ['TransactionRepository']
    }
  ],
})
export class TransactionModule {}
