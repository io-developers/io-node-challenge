import { IsNumber, IsString, validate } from "class-validator";

export class UpdatedAccountReqDto {

    @IsString()
    accountId?: string;
    @IsNumber()
    amount?: number;
    constructor(partial: Partial<UpdatedAccountReqDto>) {
        this.accountId = partial.accountId;
        this.amount = partial.amount;
    }
}