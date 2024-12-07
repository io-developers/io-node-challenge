import { Account } from "../interface/account.interface";

export interface AccountRepository {
    getAccount(id: string): Promise<Account>;
    updateAccount(id: string, amount: number): Promise<void>;
}