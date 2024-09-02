import { Account } from "../entities/Account";

export interface AccountRepository {
  findById(id: string): Promise<Account | null>;
}
