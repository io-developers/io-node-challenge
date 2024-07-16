import { Transaction } from "./transaction.entity"

export interface Activity extends Transaction {
    activityId: string
    date: string
}