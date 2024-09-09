import { updateAccount } from './accounts';

export const handler = async (event: any) => {
  console.info('Event:', JSON.stringify(event, null, 2));

  const newData = event.Records[0].dynamodb.NewImage.data.M;
  const accountId = newData.accountId.S;
  const amount = newData.amount.N;

  const rpta = await updateAccount(accountId, amount);

  return {
    statusCode: 200,
    body: JSON.stringify({
      transac_ok: rpta === true ? 'Y' : 'N',
    }),
  };
};
