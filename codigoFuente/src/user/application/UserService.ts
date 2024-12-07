import { ILogger } from "../../helper/logs/ILogger";
import { BadRequestError } from "../../helper/utils/BadRequestError";
import { IUserRepository } from "../domain/repositories/IUserRepository";
import { IUserService } from "./IUserService";

export class UserService implements IUserService {
  constructor(
    private userRepository: IUserRepository,
    private logger: ILogger
  ) {}

  async validateUserId(userId: string): Promise<boolean | null> {
    if (!userId) {
      this.logger.error("User ID is not found");
      throw new BadRequestError("User ID is not found");
    }

    this.logger.info("Validating user", { userId });
    const userResult = await this.userRepository.getUserById(userId);
    if (userResult) {
      this.logger.info("User validated successfully", { userId });
    } else {
      this.logger.info("User validation failed", { userId });
    }
    return userResult;
  }
}
