import { Injectable } from "@nestjs/common";
import { PaymentService } from "../../Domain/Services/PaymentService";
import { PaymentRequestDTO } from "../DTOs/PaymentRequestDTO";
import { PaymentResponseDTO } from "../DTOs/PaymentResponseDTO";

@Injectable()
export class PaymentUseCase {

  private readonly paymentService: PaymentService;

  constructor(paymentService: PaymentService) {
    this.paymentService = paymentService;
  }

  async createPayment(paymentRequest: PaymentRequestDTO): Promise<PaymentResponseDTO> {
    console.log(paymentRequest);
    return this.paymentService.createPayment(paymentRequest.userId);
  }
}