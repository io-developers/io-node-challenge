import { inject, injectable } from "inversify";
import { AccountRepository } from "../../domain/repository/account.repository";
import { TYPES } from "../../infraestructure/containers/inversify.constant";
import { UpdatedAccountAmountResDto } from "../dtos/response/updated-account-amount.res.dto";
import { Logger } from "@aws-lambda-powertools/logger";

const logger = new Logger({ serviceName: 'UpdateAccountUsecase' });

@injectable()
export class UpdateAccountUsecase {
  constructor(
    @inject(TYPES.AccountRepository) private accountRepository: AccountRepository
  ) {}

  async execute(accountId: string, amount: number): Promise<UpdatedAccountAmountResDto> {
    try {
      const account = await this.accountRepository.getAccount(accountId);
      const newAmount = account.amount + amount;
      await this.accountRepository.updateAccount(accountId, newAmount);
      return new UpdatedAccountAmountResDto({message: 'Updated user', account: {id: accountId, amount: newAmount}, status: 'OK'});
    } catch (error) {
      logger.error('Error updating account:', error as string | Error);
      return new UpdatedAccountAmountResDto({message: 'Error', status: 'ERROR'});
    }

  }
}