import { Account } from "../../../domain/interface/account.interface";


export class AccountObtainedResDto {

    status: string;
    message: string;
    account?: Account;
    constructor(partial: Partial<AccountObtainedResDto>) {

        this.status = partial.status || 'failure';
        this.message = partial.message || 'Transaction failed';
        if(partial.account) this.account = partial.account;
    }
}