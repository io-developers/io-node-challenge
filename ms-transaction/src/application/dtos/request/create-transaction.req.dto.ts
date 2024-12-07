import { IsNumber, IsString } from "class-validator";

export class CreateTransactionReqDto {
    @IsString()
    accountId?: string;

    @IsNumber()
    amount?: number;

    @IsNumber()
    transactionCode?: number;

    constructor(partial: Partial<CreateTransactionReqDto>) {
        this.accountId = partial.accountId || undefined;
        this.amount = partial.amount || undefined;
        this.transactionCode = partial.transactionCode || undefined
    }
}