import { AccountService } from '../services/accountService';
import { Account } from '../models/account';

export class CheckAccountUseCase {
  private accountService: AccountService;

  constructor(accountService: AccountService) {
    this.accountService = accountService;
  }

  async execute(accountId: string): Promise<Account | null> {
    console.info("use case accoundId:" + accountId);
    return this.accountService.checkAccount(accountId);
  }
}
