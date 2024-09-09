import { getAccounts } from '../accounts';

export const handler = async (event: any) => {
  console.info('Event:', event, typeof event);

  const accounts = await getAccounts();

  const transformAccount = (account: any) => {
    return {
      amount: parseFloat(account.amount.N),
      // card_id: account.card_id.S,
      id: account.id.S,
      picture: account.picture.S,
      person_name: account.person_name.S,
      // security_code: account.security_code.S,
    };
  };

  const transformedAccounts = accounts.map(transformAccount);

  return {
    statusCode: 200,
    body: JSON.stringify(transformedAccounts),
  };
};
