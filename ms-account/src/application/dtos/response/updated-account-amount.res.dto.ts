import { Account } from "../../../domain/interface/account.interface";


export class UpdatedAccountAmountResDto {

    status: string;
    message: string;
    account: Account;
    constructor(partial: Partial<UpdatedAccountAmountResDto>) {

        this.status = partial.status || 'failure';
        this.message = partial.message || 'Transaction failed';
        this.account = partial.account || { id: '', amount: 0 };
    }
}