import { TransactionHttp } from '../../../domain/entity/http/TransactionHttp';
import { TransactionHttpRepository } from '../../../domain/interface/noSql/TransactionHttpRepository';

export default class TransactionHttpRepositoryImplementMock
  implements TransactionHttpRepository
{
  async process(params: object): Promise<TransactionHttp> {
    return new TransactionHttp({ id: 12345678, message: 'success' });
  }
}
