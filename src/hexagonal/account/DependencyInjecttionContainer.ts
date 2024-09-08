import { GetAccountUseCase } from "./aplication/GetAccountUseCase";
import { InMemoryAccountRepository } from "./interface/inMemoryAccountRepository";
import { UpdateAccountUseCase } from "./aplication/UpdateAccountUseCase";
import { CreateAccountUseCase } from "./aplication/CreateAccountUseCase";

const repository = new InMemoryAccountRepository();
export const DependencyInjecttionContainer = {
  account: {
    getOne: new GetAccountUseCase(repository),
    update: new UpdateAccountUseCase(repository),
    create: new CreateAccountUseCase(repository),
  },
};
