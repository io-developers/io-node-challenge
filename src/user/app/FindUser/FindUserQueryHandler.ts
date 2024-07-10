import { Logger } from "../../../shared/Logger";
import { QueryHandler } from "../../../shared/QueryHandler";
import { Result } from "../../../shared/Result";
import { User } from "../../domain/User";
import { UserNotFound } from "../../domain/UserNotFound";
import { UserRepository } from "../../domain/UserRepo";
import { FindUserQuery } from "./FindUserQuery";

export class FindUserQueryHandler implements QueryHandler<Result<User, UserNotFound>> {
  constructor(
    private readonly userRepo: UserRepository
  ) {}

  async handle(query: FindUserQuery) {
    try {
      const user = await this.userRepo.find(query.getUserId());

      return {
        ok: user,
        err: null
      }
    } catch (e) {
      if (e instanceof UserNotFound) {
        return {
          ok: null,
          err: new UserNotFound({ userId: query.getUserId() })
        }
      }

      Logger.error(e);

      throw e;
    }
  }
}