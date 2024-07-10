export interface IUserRepository {
  getUserById(userId: string): Promise<boolean | null>;
}
