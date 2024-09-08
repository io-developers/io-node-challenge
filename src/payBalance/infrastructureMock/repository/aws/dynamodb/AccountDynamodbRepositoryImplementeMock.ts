import { Account } from '../../../../domain/entity/Account';
import { AccountRepository } from '../../../../domain/interface/noSql/AccountRepository';

export default class AccountDynamodbRepositoryImplemente
  implements AccountRepository
{
  async findById(id: string): Promise<Account | undefined> {
    if (id === 'ACCOUNT-NOT-FOUND') return undefined;

    return new Account({ id, amount: 1992 });
  }

  async updateAmount(id: string, amount: number): Promise<void> {
    console.log('updateAmount -> {message: "success"} ');
  }
}
