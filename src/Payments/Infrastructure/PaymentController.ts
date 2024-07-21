import { Body, Controller, Post } from "@nestjs/common";
import { PaymentUseCase } from "../Application/UseCases/PaymentUseCase";
import { PaymentResponseDTO } from "../Application/DTOs/PaymentResponseDTO";
import { PaymentRequestDTO } from "../Application/DTOs/PaymentRequestDTO";

@Controller('V1/payments')
export class PaymentController {
  private readonly paymentUseCase: PaymentUseCase;

  constructor(paymentUseCase: PaymentUseCase) {
    this.paymentUseCase = paymentUseCase;
  }

  @Post('create')
  async create(@Body() payment: PaymentRequestDTO): Promise<PaymentResponseDTO> {
    return this.paymentUseCase.createPayment(payment);
  }

}