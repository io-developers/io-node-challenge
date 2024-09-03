import "reflect-metadata";
import { Container } from "inversify";
import { DynamoDB } from "aws-sdk";
import { AccountRepository } from "../../domain/repository/account.repository";
import { AccountDynamoDBRepository } from "../database/repositories/account.dynamodb.repository";
import { TYPES } from "./inversify.constant";
import { ValidateAccountUsecase } from "../../application/usecases/validate-account.usecase";
import { UpdateAccountUsecase } from "../../application/usecases/update-account.usecase";
import { GetAccountUsecase } from "../../application/usecases/get-account.usecase";

const container = new Container();
container.bind<DynamoDB.DocumentClient>(TYPES.DynamoDBClient).toConstantValue(new DynamoDB.DocumentClient());
container.bind<string>(TYPES.TableName).toConstantValue(process.env.ACCOUNT_TABLE_NAME || 'default_table_name');
container.bind<AccountRepository>(TYPES.AccountRepository).to(AccountDynamoDBRepository);
container.bind<ValidateAccountUsecase>(TYPES.ValidateAccountUsecase).to(ValidateAccountUsecase);
container.bind<GetAccountUsecase>(TYPES.GetAccountUsecase).to(GetAccountUsecase);
container.bind<UpdateAccountUsecase>(TYPES.UpdateAccountUsecase).to(UpdateAccountUsecase);
export { container };