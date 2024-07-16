import { Payment } from "../entity/payment.entity";
import { Transaction } from "../entity/transaction.entity";

export interface IPaymentRepository {
    execute(payment: Payment): Promise<Transaction>;
}