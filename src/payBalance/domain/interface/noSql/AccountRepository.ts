import { Account } from '../../entity/Account';

export interface AccountRepository {
  findById(id: string): Promise<Account>;
  updateAmount(id: string, amount: number): Promise<void>;
}
