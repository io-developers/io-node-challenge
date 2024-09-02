import dynamoDb from '../utils/dynamoDB';
import { Account } from '../models/Account';

const TABLE_NAME = process.env.DYNAMO_ACCOUNTS_TABLE || '';

const defaultParams = (id: string) => ({
  TableName: TABLE_NAME,
  Key: { id },
});

export class AccountService {

  async getAccountById(accountId: string): Promise<Account | null> {
    const params = { ...defaultParams(accountId) };
    const result = await dynamoDb.get(params).promise();
    return result.Item as Account | null;
  }

}
