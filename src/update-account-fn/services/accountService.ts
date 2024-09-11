import { AccountRepository } from '../repositories/accountRepository';

export class AccountService {
  private accountRepository: AccountRepository;

  constructor(accountRepository: AccountRepository) {
    this.accountRepository = accountRepository;
  }

  async updateAccount(accountId: string, amount: number): Promise<void> {
    await this.accountRepository.updateAccount(accountId, amount);
  }
}
