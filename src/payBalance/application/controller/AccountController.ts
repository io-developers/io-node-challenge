import { UpdateAccountUseCase } from '../../domain/interface/useCase/UpdateAccountUseCase';
import { GetAccountByIdUseCase } from '../../domain/interface/useCase/GetAccountByIdUseCase';

export default class AccountController {
  constructor(
    private readonly updateAccountUseCase: UpdateAccountUseCase,
    private readonly getAccountByIdUseCase: GetAccountByIdUseCase
  ) {}

  async updateAmount(event) {
    try {
      let row;
      event.Records.forEach((record: any) => {
        row = record.dynamodb.NewImage;
      });
      const result = await this.updateAccountUseCase.execute(row);
      return {
        statusCode: 200,
        body: JSON.stringify(result),
      };
    } catch (error) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Something was wrong' }),
      };
    }
  }

  async getAccountById(event) {
    try {
      const { accountId } = event.pathParameters;
      const result = await this.getAccountByIdUseCase.execute(accountId);
      return {
        statusCode: 200,
        body: JSON.stringify(result),
      };
    } catch (error) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: error.message }),
      };
    }
  }
}
