import { IUserService } from './IUserService';
import { User } from '../../domain/models/User';
import { IUserRepository } from '../../domain/repositories/IUserRepository';

export class UserService implements IUserService {
  constructor(private userRepository: IUserRepository) {}

  async validateUser(userId: string): Promise<User | null> {
    return await this.userRepository.getUserById(userId);
  }

  async createUser(user: User): Promise<void> {
    await this.userRepository.createUser(user);
  }
}
