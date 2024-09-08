import { Account, AccountModelDB } from '../../../../domain/entity/Account';
import { AccountRepository } from '../../../../domain/interface/noSql/AccountRepository';
import BaseDynamoDBRepository from './BaseDynamoDBRepository';

export default class AccountDynamodbRepositoryImplemente
  extends BaseDynamoDBRepository<Account, AccountModelDB>
  implements AccountRepository
{
  tableName = process.env.ACCOUNTS_TABLE_DYNAMODB ?? '';

  toEntity(model: AccountModelDB): Account {
    return Account.create(model);
  }

  async findById(id: string): Promise<Account> {
    const findParams = {
      KeyConditionExpression: 'id = :id',
      ExpressionAttributeValues: {
        ':id': id,
      },
    };

    return this.query(findParams).then((result) => result[0]);
  }

  async updateAmount(id: string, amount: number): Promise<void> {
    const updateParams = {
      key: { id },
      updateExpression: 'set amount = :amount',
      expresionValues: {
        ':amount': amount,
      },
    };
    const resultUpdate = await this.update(updateParams);
  }
}
