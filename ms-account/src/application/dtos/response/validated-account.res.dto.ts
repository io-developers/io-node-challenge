export class ValidatedAccountResDto {

    status: string;
    message: string;
    accountId?: string;
    constructor(partial: Partial<ValidatedAccountResDto>) {

        this.status = partial.status || 'failure';
        this.message = partial.message || 'Transaction failed';
        if(partial.accountId) this.accountId = partial.accountId;
    }
}