import { Controller } from "@nestjs/common";
import { PaymentUseCase } from "../Application/UseCases/PaymentUseCase";
import { PaymentResponseDTO } from "../Application/DTOs/PaymentResponseDTO";
import { PaymentRequestDTO } from "../Application/DTOs/PaymentRequestDTO";

@Controller()
export class PaymentController {
  private readonly paymentUseCase: PaymentUseCase;

  constructor(paymentUseCase: PaymentUseCase) {
    this.paymentUseCase = paymentUseCase;
  }

  async execute(action: string, request: object): Promise<object> {
    console.log('-- PaymentController.execute --');
    console.log({
      action,
      request
    });
    return this[action](request);
  }

  async create(payment: PaymentRequestDTO): Promise<PaymentResponseDTO> {
    console.log('-- PaymentController.create --');
    return this.paymentUseCase.createPayment(payment);
  }

}