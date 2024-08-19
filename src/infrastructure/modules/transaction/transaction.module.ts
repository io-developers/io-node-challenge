import { Module } from '@nestjs/common';
import { GetTransactionController } from '@infrastructure/presentation/transaction/http/v1/getTransaction.controller';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { GetTransactionUseCase } from '@application/usecases/transaction/getTransaction.usecase';
import { TransactionServiceHttp } from '../../service/http/transaction.service';
import { TransactionService } from '@application/service/transaction.service';

@Module({
  exports: [TransactionServiceHttp],
  controllers: [GetTransactionController],
  providers: [
    TransactionServiceHttp,
    DynamoDBClient,
    {
      provide: 'GetTransactionUseCase',
      inject: [TransactionServiceHttp],
      useFactory: (transactionsService: TransactionService) => {
        return new GetTransactionUseCase(transactionsService);
      },
    },
  ],
})
export class TransactionModule {}
