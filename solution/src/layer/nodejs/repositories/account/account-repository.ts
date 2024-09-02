import { Account } from "../../models/account";

export interface AccountRepository {
    getAccount(accountId: string): Promise<Account | null>;
    updateAccountBalance(accountId: string, newBalance: number): Promise<void>;
}