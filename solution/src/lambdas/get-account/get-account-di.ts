import { AccountRepository } from "/opt/nodejs/repositories/account/account-repository";
import { AccountProvider } from "/opt/nodejs/repositories/account/account-provider";
import { GetAccountUseCase } from "./get-account-use-case";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

export class GetAccountDependencyInjectionContainer {
  private accountRepository: AccountRepository;
  public getAccountUseCase: GetAccountUseCase;
  
  constructor() {
    this.accountRepository = new AccountProvider(new DynamoDBClient({}));
    this.getAccountUseCase = new GetAccountUseCase(this.accountRepository)
  }
}