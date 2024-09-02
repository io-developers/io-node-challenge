import { AccountRepository } from "/opt/nodejs/repositories/account/account-repository";

export class UpdateAccountUseCase {
  
  constructor(private readonly accountRepository: AccountRepository) {}

  async updateAccount(accountId: string, amount: number): Promise<void> {
    const account = await this.accountRepository.getAccount(accountId);
      if (!account) {
        throw new Error(`Account ${accountId} not found.`)
      }

      const newAmount = account.amount + amount;
      await this.accountRepository.updateAccountBalance(accountId, newAmount);
  }
}