import { CreateAccountUseCase } from "./account/aplication/CreateAccountUseCase";
import { GetAccountUseCase } from "./account/aplication/GetAccountUseCase";
import { UpdateAccountUseCase } from "./account/aplication/UpdateAccountUseCase";
import { InMemoryAccountRepository } from "./account/interface/InMemoryAccountRepository";
import { ExecutePaymentUseCase } from "./transaction/aplication/ExecutePaymentUseCase";
import { GetPaymentUseCase } from "./transaction/aplication/GetPaymentUseCase";
import { InMemoryTransactionRepository } from "./transaction/infraestructure/InMemoryTransactionRepository";

const repositoryAcount = new InMemoryAccountRepository();
const repositoryTransacction = new InMemoryTransactionRepository();

export const DependencyInjecttionContainer = {
  account: {
    getOne: new GetAccountUseCase(repositoryAcount),
    update: new UpdateAccountUseCase(repositoryAcount),
    create: new CreateAccountUseCase(repositoryAcount),
  },
  transaction: {
    create: new ExecutePaymentUseCase(repositoryTransacction),
    getOne: new GetPaymentUseCase(repositoryTransacction),
  },
};
