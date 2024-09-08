import { AccountRepository } from '../../domain/interface/noSql/AccountRepository';
import { Account } from '../../domain/entity/Account';
import { GetAccountByIdUseCase } from '../../domain/interface/useCase/GetAccountByIdUseCase';

export default class GetAccountByIdUseCaseImplement
  implements GetAccountByIdUseCase
{
  constructor(private readonly accountRepository: AccountRepository) {}

  async execute(acountId: string) {
    const account: Account = await this.accountRepository.findById(acountId);
    if (!account) {
      throw new Error('Account not found');
    }
    return account.toData();
  }
}
