import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { TransactionUseCase } from '../Application/UseCases/TransactionUseCase';
import { TransactionRequestDTO } from '../Application/DTOs/TransactionRequestDTO';

@Controller('V1/transactions')
export class TransactionController {

    private readonly transactionUseCase: TransactionUseCase;

    constructor(transactionUseCase: TransactionUseCase) {
        this.transactionUseCase = transactionUseCase;
    }

    @Post()
    async create(@Body() transaction: TransactionRequestDTO) {
        return this.transactionUseCase.createTransaction(transaction);
    }

    @Get()
    async getTransaction(@Query('transactionId') transactionId: string) {
        console.log('-- TransactionController.getTransaction --');
        console.log('transactionId:', transactionId);
        return this.transactionUseCase.getTransaction(transactionId);
    }

}