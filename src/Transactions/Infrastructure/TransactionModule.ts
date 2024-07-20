import { Module } from '@nestjs/common';
import { TransactionsController } from './TransactionsController';
import { TransactionService } from '../Domain/Services/TransactionService';
import { TransactionUseCase } from '../Application/UseCases/TransactionUseCase';
import { TransactionRepositoryImpl } from './Adapters/TransactionRepositoryImpl';

@Module({
    controllers: [
        TransactionsController
    ],
    providers: [
        TransactionService,
        TransactionUseCase,
        {
            provide: 'TransactionRepository',
            useClass: TransactionRepositoryImpl
        }
    ],
})
export class TransactionModule {}