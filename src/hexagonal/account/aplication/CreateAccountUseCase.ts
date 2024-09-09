import { Account } from "../domain/Account";
import { AccountNotFoundError } from "../domain/AccountNotFoundError";
import { AccountRepository } from "../domain/AccountRepository";
import { AccountAmout } from "../domain/value-object/account-amout.vo";
import { AccountId } from "../domain/value-object/account-id.vo";

export class CreateAccountUseCase {
  constructor(private repository: AccountRepository) {}

  async execute(id: string, amount: number): Promise<void> {
    const account = new Account(new AccountId(id), new AccountAmout(amount));

    return this.repository.create(account);
  }
}
