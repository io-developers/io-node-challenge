import { Payment } from "../domain/entities/payment.entity";
import { HttpError } from "../domain/exceptions/payment.exception";
import { IPaymentRepository } from "../domain/repository/payment.repository";

export class PaymentsService {

  constructor(private readonly repositoryPayment: IPaymentRepository) {}

  async executePayments(payload: Payment) {
      const { success, result } = await this.repositoryPayment.execute(payload);
      if (success) {
        return result
      }
      throw new HttpError();
  }
}
