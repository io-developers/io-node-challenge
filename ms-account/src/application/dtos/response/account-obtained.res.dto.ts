export class AccountObtainedResDto {
    message?: string;
    id?: string;
    amount?: string;
    constructor(partial: Partial<AccountObtainedResDto>) {
        if(partial.id) {   
            this.id = partial.id
            this.amount = partial.amount;
        } else {
            this.message = partial.message || 'Account not found';
        }
    }
}