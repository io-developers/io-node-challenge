import { AccountRepository } from "../../domain/repositories/AccountRepository";
import { Account } from "../../domain/entities/Account";

export class GetAccountDetailsUseCase {
  constructor(private accountRepository: AccountRepository) {}

  async execute(accountId: string): Promise<Account> {
    const account = await this.accountRepository.findById(accountId);
    if (!account) {
      throw new Error(`Account with ID ${accountId} not found`);
    }
    return account;
  }
}
