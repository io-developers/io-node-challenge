import { Injectable } from "@nestjs/common";
import { v4 as uuidv4 } from 'uuid';
import { PaymentService } from "../../Domain/Services/PaymentService";
import { PaymentRequestDTO } from "../DTOs/PaymentRequestDTO";
import { PaymentResponseDTO } from "../DTOs/PaymentResponseDTO";
import { RESPONSE_STATUS } from "../../../Commons/Constants";

@Injectable()
export class PaymentUseCase {

  private readonly paymentService: PaymentService;

  constructor(paymentService: PaymentService) {
    this.paymentService = paymentService;
  }

  async createPayment(paymentRequest: PaymentRequestDTO): Promise<PaymentResponseDTO> {
    console.log('-- PaymentUseCase.createPayment --');
    console.log(paymentRequest);
    const result = await this.paymentService.createPayment(paymentRequest.userId);
    let responsePayment: PaymentResponseDTO = result;
    if (responsePayment.status === RESPONSE_STATUS.OK) {
      responsePayment.transactionId = uuidv4();
    }
    return responsePayment
  }
}