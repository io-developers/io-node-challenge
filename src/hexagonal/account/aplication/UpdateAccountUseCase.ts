import { Account } from "../domain/Account";
import { AccountNotFoundError } from "../domain/AccountNotFoundError";
import { AccountRepository } from "../domain/AccountRepository";
import { AccountAmout } from "../domain/value-object/account-amout.vo";
import { AccountId } from "../domain/value-object/account-id.vo";

export class UpdateAccountUseCase {
  constructor(private repository: AccountRepository) {}

  async execute(id: string, amount: number): Promise<void> {
    const account = new Account(new AccountId(id), new AccountAmout(amount));

    const exists = this.repository.getOneById(account.id);

    if (!exists) {
      throw new AccountNotFoundError("Account not found");
    }

    return this.repository.update(account);
  }
}
