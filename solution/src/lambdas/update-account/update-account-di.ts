import { AccountRepository } from "/opt/nodejs/repositories/account/account-repository";
import { AccountProvider } from "/opt/nodejs/repositories/account/account-provider";
import { UpdateAccountUseCase } from "./update-account-use-case";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

export class UpdateAccountDependencyInjectionContainer {
  public accountRepository: AccountRepository;
  public updateAccountUseCase: UpdateAccountUseCase;
  
  constructor() {
    this.accountRepository = new AccountProvider(new DynamoDBClient({}));
    this.updateAccountUseCase = new UpdateAccountUseCase(this.accountRepository)
  }
}