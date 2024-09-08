import { TransactionHttp } from '../../entity/http/TransactionHttp';

export interface TransactionHttpRepository {
  process(params: object): Promise<TransactionHttp>;
}
