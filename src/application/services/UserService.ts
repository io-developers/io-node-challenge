import { IUserService } from './IUserService';
import { User } from '../../domain/models/User';
import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { ILogger } from '../../infrastructure/utils/ILogger';

export class UserService implements IUserService {
  constructor(
    private userRepository: IUserRepository,
    private logger: ILogger,
  ) {}

  async validateUser(userId: string): Promise<User | null> {
    this.logger.info('Validating user', { userId });
    const user = await this.userRepository.getUserById(userId);
    if (user) {
      this.logger.info('User validated successfully', { userId });
    } else {
      this.logger.info('User validation failed', { userId });
    }
    return user;
  }

  async createUser(user: User): Promise<void> {
    this.logger.info('Creating user', { user });
    await this.userRepository.createUser(user);
    this.logger.info('User created successfully', { userId: user.userId });
  }
}
