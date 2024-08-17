import { UserRepository } from './UserRepository';

export class UserService {
  private userRepository: UserRepository;
  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  async userExists(userId: string): Promise<boolean> {
    return (await this.userRepository.get(userId)) !== null;
  }
}
