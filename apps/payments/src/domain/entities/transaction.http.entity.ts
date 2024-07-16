import { Transaction } from "./transaction.entity";

export interface HttpTransaction {
    success: boolean,
    result: Transaction
}