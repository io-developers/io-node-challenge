import { AccountService } from '../services/accountService';

export class UpdateAccountUseCase {
  private accountService: AccountService;

  constructor(accountService: AccountService) {
    this.accountService = accountService;
  }

  async execute(accountId: string, amount: number): Promise<void> {
    await this.accountService.updateAccount(accountId, amount);
  }
}
