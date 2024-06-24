import { User } from '../../domain/models/User';

export interface IUserService {
  validateUser(userId: string): Promise<User | null>;
  createUser(user: User): Promise<void>;
}
