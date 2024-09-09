import { getAccountById } from '../../common/accounts';
import { Account } from '../../common/types';

type GetAccountRequest = {
  accountId: string;
  amount: number;
};

type GetAccountResponse = {
  exists: string;
  amount_new?: number;
  account: Account | null;
};

export const handler = async (event: GetAccountRequest) => {
  console.info('Event:', event, typeof event);
  console.info('test:', event.accountId, event.amount);

  const { accountId, amount } = event;

  // TODO validations

  const account = await getAccountById(accountId);

  const response: GetAccountResponse = {
    exists: account ? 'Y' : 'N',
    amount_new: amount,
    account,
  };

  return {
    statusCode: 200,
    body: JSON.stringify({
      ...response,
    }),
  };
};
