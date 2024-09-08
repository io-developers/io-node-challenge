export class CreatedTransactionResDto {
    message?: string;
    transactionId?: string;


    constructor(partial: Partial<CreatedTransactionResDto>) {
        if(partial.transactionId) {
            this.transactionId = partial.transactionId;
        } else {
            this.message = 'Something was wrong';
        }
    }
}