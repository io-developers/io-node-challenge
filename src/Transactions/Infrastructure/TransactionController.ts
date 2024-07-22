import { Body, Controller, Get, Param, Post } from '@nestjs/common';
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

    @Get(':id')
    async getTransaction(@Param('id') id: string) {
        console.log('-- TransactionController.getTransaction --');
        return this.transactionUseCase.getTransaction(id);
    }

}