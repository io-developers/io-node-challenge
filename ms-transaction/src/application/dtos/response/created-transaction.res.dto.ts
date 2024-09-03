import { Transaction } from "../../../domain/interface/transaction.interface";


export class CreatedTransactionResDto {

    status: string;
    message: string;
    transaction: Transaction;
    constructor(partial: Partial<CreatedTransactionResDto>) {

        this.status = partial.status || 'failure';
        this.message = partial.message || 'Transaction failed';
        this.transaction = partial.transaction || {source: '', id: 0, data: {accountId: '', amount: 0}};
    }
}