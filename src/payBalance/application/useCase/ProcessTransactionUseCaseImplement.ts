import { TransactionHttp } from '../../domain/entity/http/TransactionHttp';
import { TransactionHttpRepository } from '../../domain/interface/noSql/TransactionHttpRepository';
import { ProcessTransactionUseCase } from '../../domain/interface/useCase/ProcessTransactionUseCase';

export default class ProcessTransactionUseCaseImplement
  implements ProcessTransactionUseCase
{
  constructor(
    private readonly transactionHttpRepository: TransactionHttpRepository
  ) {}

  async execute() {
    const transaction: TransactionHttp = await this.transactionHttpRepository.process({});
    return transaction.toData();
  }
}
