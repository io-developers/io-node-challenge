import { Account } from "/opt/nodejs/models/account";
import { AccountRepository } from "/opt/nodejs/repositories/account/account-repository";

export class GetAccountUseCase {
  
  constructor(private readonly accountRepository: AccountRepository) {}

  async getAccount(accountId: string): Promise<Account | null> {
    return await this.accountRepository.getAccount(accountId);
  }
}