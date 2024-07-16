import { Transaction } from '../../domain/entity/transaction.entity';
import { IPaymentRepository } from "../../domain/repository/payment.repository";
import { Payment } from '../../domain/entity/payment.entity';
import { Injectable, Logger } from '@nestjs/common';
import { v4 as uuid } from 'uuid'

@Injectable()
export class PaymentRepository implements IPaymentRepository {
    
    constructor(private readonly logger: Logger) { }

    async execute(payment: Payment): Promise<Transaction> {
        this.logger.log('Start return mocks transaction', 'PaymentRepository - execute');
        return {
            transactionId: uuid(),
            transactionDescription: "Success Transaction",
            amount: payment.amount,
            userId: payment.userId,
        }
    }
}
