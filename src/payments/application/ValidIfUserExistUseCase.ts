import { UserService } from '../domain/UserService';

export class ValidIdUserExistUseCase {
  private userService: UserService;
  constructor(userService: UserService) {
    this.userService = userService;
  }

  async execute(userId: string): Promise<boolean> {
    return await this.userService.userExists(userId);
  }
}
