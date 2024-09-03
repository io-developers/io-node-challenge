import { inject, injectable } from "inversify";
import { AccountRepository } from "../../domain/repository/account.repository";
import { ValidatedAccountResDto } from "../dtos/response/validated-account.res.dto";
import { TYPES } from "../../infraestructure/containers/inversify.constant";
import { Logger } from "@aws-lambda-powertools/logger";

const logger = new Logger({ serviceName: 'UpdateAccountUsecase' });

@injectable()
export class ValidateAccountUsecase {
  constructor(
    @inject(TYPES.AccountRepository) private accountRepository: AccountRepository
  ) {}

  async execute(accountId: string): Promise<ValidatedAccountResDto> {
    try {
      const validatedUser = await this.accountRepository.getAccount(accountId);
      logger.info(`Validated user: ${validatedUser}`);
      if(!validatedUser) {
        return new ValidatedAccountResDto({message: 'User not found', status: 'ERROR'});
      }
      return new ValidatedAccountResDto({message: 'Validated user', accountId, status: 'OK'});
    } catch (error) {
      logger.error('Error validating account:', error as string | Error);
      return new ValidatedAccountResDto({message: 'Error', status: 'ERROR'});
    }

  }
}