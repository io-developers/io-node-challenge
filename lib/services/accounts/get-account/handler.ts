import { getAccountById } from '../../common/accounts';
import { Account } from '../../common/types';

export const handler = async (event: any) => {
  console.info('Event:', event, typeof event);

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
