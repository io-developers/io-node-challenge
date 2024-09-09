import { Account } from "../domain/Account";
import { AccountRepository } from "../domain/AccountRepository";
import { AccountId } from "../domain/value-object/account-id.vo";

export class InMemoryAccountRepository implements AccountRepository {
  private accountModel: Account[] = [];
  async getOneById(id: AccountId): Promise<Account | null> {
    return this.accountModel.find((user) => user.id.value === id.value) || null;
  }
  async create(account: Account): Promise<void> {
    this.accountModel.push(account);
  }
  async update(account: Account): Promise<void> {
    const index = this.accountModel.findIndex(
      (u) => u.id.value == account.id.value
    );
    this.accountModel[index] = account;
  }
}
