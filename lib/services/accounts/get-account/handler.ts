import { getAccountById } from '../../common/accounts';
import { getLogger } from '../../common/logger';
import { Account } from '../../common/types';

export const handler = async (event: any) => {
  const accountId = event.pathParameters?.accountId;

  const accountResponse = await getAccountById(accountId);

  const account: Partial<Account> = {
    amount: accountResponse!.amount,
    id: accountResponse!.id,
  };

  return {
    statusCode: 200,
    body: JSON.stringify(account),
  };
};
