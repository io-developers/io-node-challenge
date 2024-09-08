import {
  TransactionHttp,
  TransactionHttpModelDB,
} from '../../../domain/entity/http/TransactionHttp';
import { TransactionHttpRepository } from '../../../domain/interface/noSql/TransactionHttpRepository';
import BaseHttpClient from './BaseHttpClient';

export default class TransactionHttpRepositoryImplement
  extends BaseHttpClient
  implements TransactionHttpRepository
{
  baseUrl = process.env.FAKE_API_TRANSACTION;

  toEntity(model: TransactionHttpModelDB): TransactionHttp {
    return TransactionHttp.create(model);
  }

  async process(params: object): Promise<TransactionHttp> {
    const path = '/transactions';
    const result = await this.post(path, params);
    return this.toEntity(result);
  }
}
