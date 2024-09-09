import { Account } from "../domain/Account";
import { AccountNotFoundError } from "../domain/AccountNotFoundError";
import { AccountRepository } from "../domain/AccountRepository";
import { AccountId } from "../domain/value-object/account-id.vo";

export class GetAccountUseCase {
  constructor(private repository: AccountRepository) {}

  async execute(id: string): Promise<Account> {
    const accountId = new AccountId(id);
    const account = await this.repository.getOneById(accountId);

    if (!account) {
      throw new AccountNotFoundError("Account not found");
    }
    return account;
  }
}
