import "reflect-metadata";
import { Container } from "inversify";
import { DynamoDB } from "aws-sdk";
import { TYPES } from "./inversify.constant";
import { TransactionRepository } from "../../domain/repository/transaction.repository";
import { TransactionDynamoDBRepository } from "../database/repositories/transaction.dynamodb.repository";
import { CreateTransactionUsecase } from "../../application/usecases/create-transaction.usecase";


const container = new Container();
container.bind<DynamoDB.DocumentClient>(TYPES.DynamoDBClient).toConstantValue(new DynamoDB.DocumentClient());
container.bind<string>(TYPES.TableName).toConstantValue(process.env.TRANSACTION_TABLE_NAME || 'default_table_name');
container.bind<TransactionRepository>(TYPES.TransactionRepository).to(TransactionDynamoDBRepository);
container.bind<CreateTransactionUsecase>(TYPES.CreateTransactionUsecase).to(CreateTransactionUsecase);

export { container };