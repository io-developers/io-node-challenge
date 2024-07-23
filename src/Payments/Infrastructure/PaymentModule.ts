import { Module } from "@nestjs/common";
import { PaymentController } from "./PaymentController";
import { PaymentService } from "../Domain/Services/PaymentService";
import { PaymentUseCase } from "../Application/UseCases/PaymentUseCase";

@Module({
    controllers: [
        PaymentController
    ],
    providers: [
        PaymentService,
        PaymentUseCase
    ],
})
export class PaymentModule {}