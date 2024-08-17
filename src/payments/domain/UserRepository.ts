import { User } from './User';

export interface UserRepository {
  get(userId: string): Promise<User | null>;
}
