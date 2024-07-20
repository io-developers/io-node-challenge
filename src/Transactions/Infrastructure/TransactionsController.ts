import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { TransactionUseCase } from '../Application/UseCases/TransactionUseCase';
import { TransactionRequestDTO } from '../Application/DTOs/TransactionRequestDTO';

@Controller('v1/transactions')
export class TransactionsController {

    private readonly transactionUseCase: TransactionUseCase;

    constructor(transactionUseCase: TransactionUseCase) {
        this.transactionUseCase = transactionUseCase;
    }

    @Post()
    async create(@Body() transaction: TransactionRequestDTO) {
        return this.transactionUseCase.createTransaction(transaction);
    }

    @Get(':id')
    async getTransaction(@Param('id') id: string) {
        return this.transactionUseCase.getTransaction(id);
    }

}