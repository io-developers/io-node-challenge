export interface IUserService {
  validateUserId(userId : string): Promise<boolean | null>;
}
