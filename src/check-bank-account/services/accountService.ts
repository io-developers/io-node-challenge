import { AccountRepository } from '../repositories/accountRepository';
import { Account } from '../models/account';

export class AccountService {
  private accountRepository: AccountRepository;

  constructor(accountRepository: AccountRepository) {
    this.accountRepository = accountRepository;
  }

  async checkAccount(accountId: string): Promise<Account | null> {
    console.info("services accoundId:" + accountId);
    return this.accountRepository.checkAccount(accountId);
  }
}
