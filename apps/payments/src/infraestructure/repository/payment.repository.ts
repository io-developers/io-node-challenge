import { HttpService } from "@nestjs/axios";
import { Payment } from "../../domain/entities/payment.entity";
import { Transaction } from "../../domain/entities/transaction.entity";
import { IPaymentRepository } from "../../domain/repository/payment.repository";
import { Injectable, Logger } from "@nestjs/common";
import { HttpTransaction } from "../../domain/entities/transaction.http.entity";

@Injectable()
export class PaymentRepository implements IPaymentRepository {
    constructor(private readonly httpService: HttpService,  private readonly logger: Logger) {}
    async execute(payload: Payment): Promise<HttpTransaction> {
        this.logger.log('Start execute payments', 'PaymentRepository - execute');
        try {
            const result =  await this.httpService.axiosRef.post<HttpTransaction>(process.env.HTTP_API_MOCK, payload);
            return result.data;
            
        } catch (error) {
            this.logger.error(`Http Error ${JSON.stringify(error)}`, 'PaymentRepository - execute');
            throw error;
        }
    }
}
