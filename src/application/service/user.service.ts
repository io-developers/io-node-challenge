export interface UserService {
  validateUser(userId: string): Promise<boolean>;
  getUserById(userId: string): Promise<any>;
}
