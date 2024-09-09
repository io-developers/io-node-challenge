import { CreateAccountUseCase } from "./account/aplication/CreateAccountUseCase";
import { GetAccountUseCase } from "./account/aplication/GetAccountUseCase";
import { UpdateAccountUseCase } from "./account/aplication/UpdateAccountUseCase";
import { DynamoDbAccountRepository } from "./account/interface/DynamoDbAccountRepository";
import { InMemoryAccountRepository } from "./account/interface/InMemoryAccountRepository";
import { ExecutePaymentUseCase } from "./transaction/aplication/ExecutePaymentUseCase";
import { GetPaymentUseCase } from "./transaction/aplication/GetPaymentUseCase";
import { DynamoDbTransactionRepository } from "./transaction/infraestructure/DynamoDbTransactionRepository";
import { InMemoryTransactionRepository } from "./transaction/infraestructure/InMemoryTransactionRepository";

const repositoryAcount = new InMemoryAccountRepository();
const repositoryTransacction = new InMemoryTransactionRepository();
const repositoryDynamoDbTransacction = new DynamoDbTransactionRepository();
const repositoryDynamoDbAccount = new DynamoDbAccountRepository();

export const DependencyInjecttionContainer = {
  account: {
    getOne: new GetAccountUseCase(repositoryAcount),
    update: new UpdateAccountUseCase(repositoryAcount),
    create: new CreateAccountUseCase(repositoryAcount),
  },
  DAccount: {
    getOne: new GetAccountUseCase(repositoryDynamoDbAccount),
    update: new UpdateAccountUseCase(repositoryDynamoDbAccount),
  },
  transaction: {
    create: new ExecutePaymentUseCase(repositoryTransacction),
    getOne: new GetPaymentUseCase(repositoryTransacction),
  },
  DTransaction: {
    create: new ExecutePaymentUseCase(repositoryDynamoDbTransacction),
  },
};
