
import { Payment } from "../../domain/entities/payment.entity";

export class PaymentDto implements Payment {
  userId: string;
  transactionId: string;
  status: string;

  constructor() {
    this.userId = '';
    this.transactionId = '';
    this.status = '';
  }
}
