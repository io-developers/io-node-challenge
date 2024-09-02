import { Transaction } from '../entity/Transaction';

export interface IActivityRepository {
  saveActivity(transaction: Transaction): Promise<Transaction | null>;
}
