import middy from '@middy/core';
import AccountController from '../../application/controller/AccountController';
import UpdateAccountUseCaseImplement from '../../application/useCase/UpdateAccountUseCaseImplement';
import GetAccountByIdUseCaseImplement from '../../application/useCase/GetAccountByIdUseCaseImplement';
import AccountDynamodbRepositoryImplemente from '../repository/aws/dynamodb/AccountDynamodbRepositoryImplementeMock';
import TransactionController from '../../application/controller/TransactionController';
import ProcessTransactionUseCaseImplement from '../../application/useCase/ProcessTransactionUseCaseImplement';
import TransactionHttpRepositoryImplement from '../repository/http/TransactionHttpRepositoryImplementMock';

class Root {
  private accountController: AccountController;
  private transactionController: TransactionController;

  constructor() {
    // Repositories
    const accountDynamodbRepository = new AccountDynamodbRepositoryImplemente();
    const transactionHttpRepositoryImplement =
      new TransactionHttpRepositoryImplement();

    // UsesCases
    const updateAccountUseCase = new UpdateAccountUseCaseImplement(
      accountDynamodbRepository
    );
    const getAccountByIdUseCase = new GetAccountByIdUseCaseImplement(
      accountDynamodbRepository
    );
    const processTransactionUseCaseImplement =
      new ProcessTransactionUseCaseImplement(
        transactionHttpRepositoryImplement
      );

    // controllers
    this.accountController = new AccountController(
      updateAccountUseCase,
      getAccountByIdUseCase
    );
    this.transactionController = new TransactionController(
      processTransactionUseCaseImplement
    );
  }

  public async handle(event: any, functionName: string): Promise<any> {
    console.log("functionName:", functionName)
    if (functionName === 'update-account') {
      return await this.accountController.updateAmount(event);
    }
    if (functionName === 'get-account') {
      return await this.accountController.getAccountById(event);
    }
    if (functionName === 'execute-payment') {
      return await this.transactionController.processTransaction();
    }
    return { statusCode: 400, body: 'Action not found' };
  }
}

const root = new Root();

const handler = middy(root.handle.bind(root));

export default handler;
