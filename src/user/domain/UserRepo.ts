import { User } from "./User";

export abstract class UserRepository {
  abstract find(userId: string): Promise<User>;
}