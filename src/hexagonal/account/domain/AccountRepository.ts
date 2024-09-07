import { Account } from "./account";
import { AccountId } from "./value-object/account-id.vo";

export interface AccountRepository {
  getOneById(id: AccountId): Promise<Account | null>;
  create(account: Account): Promise<void>;
  update(account: Account): Promise<void>;
}
