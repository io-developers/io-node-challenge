import { Account } from '../../domain/entity/Account';
import { AccountRepository } from '../../domain/interface/noSql/AccountRepository';
import { InputUpdateAccount, UpdateAccountUseCase } from '../../domain/interface/useCase/UpdateAccountUseCase';

export default class UpdateAccountUseCaseImplement
  implements UpdateAccountUseCase
{
  constructor(private readonly accountRepository: AccountRepository) {}
  async execute(payload: InputUpdateAccount) {
    if (!payload.data) throw new Error('Input Error');

    const row = this.unserializeData(payload.data);
    const { accountId, amount } = row;
    const account: Account = await this.accountRepository.findById(accountId);

    if (!account) {
      return {
        message: `No record was found, id: ${accountId}`
      };
    }

    const newAmount: number = amount + account.amount;
    await this.accountRepository.updateAmount(account.id, newAmount);

    return { message: 'Updated successfully' };
  }

  unserializeData(data) {
    return {
      accountId: data?.M?.accountId?.S,
      amount: Number(data?.M?.amount?.N) || undefined,
    };
  }
}
