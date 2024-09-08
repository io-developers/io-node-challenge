import { ProcessTransactionUseCase } from '../../domain/interface/useCase/ProcessTransactionUseCase';

export default class TransactionController {
  constructor(
    protected readonly processTransactionUseCase: ProcessTransactionUseCase
  ) {}

  async processTransaction() {
    try {
      return await this.processTransactionUseCase.execute();
    } catch (error) {
      return {
        statusCode: 400,
        body: { message: 'Something was wrong' }
      };
    }
  }
}
