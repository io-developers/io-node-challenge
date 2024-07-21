import { Module } from '@nestjs/common';
import { TransactionController } from './TransactionController';
import { TransactionService } from '../Domain/Services/TransactionService';
import { TransactionUseCase } from '../Application/UseCases/TransactionUseCase';
import { TransactionRepositoryImpl } from './Adapters/TransactionRepositoryImpl';

@Module({
    controllers: [
        TransactionController
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