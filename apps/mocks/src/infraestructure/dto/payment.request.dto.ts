import { IsNumber, IsString, IsUUID } from "class-validator";
import { Payment } from "../../domain/entity/payment.entity";

export class PaymentRequestDto implements Payment {
    @IsUUID()
    userId: string;

    @IsNumber()
    amount: number;
}