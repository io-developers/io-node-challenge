import { TransactionDataVo } from "./value-object/transaction-data.vo";
import { TransactionIdVo } from "./value-object/transaction-id.vo";
import { TransactionSourceVo } from "./value-object/transaction-source.vo";

export class Transaction{
    source: TransactionSourceVo;
    id:TransactionIdVo;
    data: TransactionDataVo;

    constructor(soruce:TransactionSourceVo,id:TransactionIdVo,data:TransactionDataVo) {
        this.source = soruce;
        this.id = id;
        this.data = data;
    }

    mapToPrimitives(){
        return {
            source: this.source.value,
            id: this.id.value,
            data:{
                accountId: this.data.accountId,
                amount: this.data.amount
            } 
        }
    }
}