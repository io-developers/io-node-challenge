import { Payment } from "../entities/payment.entity";
import { Transaction } from "../entities/transaction.entity";
import { HttpTransaction } from "../entities/transaction.http.entity";

export interface IPaymentRepository {
    execute(payload: Payment): Promise<HttpTransaction>
}