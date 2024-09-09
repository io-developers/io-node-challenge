import { UpdateItemCommand } from '@aws-sdk/client-dynamodb';
import { marshall } from '@aws-sdk/util-dynamodb';

import { ACCOUNTS_TABLE } from '../../common/constants';
import { getClient } from '../../common/dynamodb';

const client = getClient();

export const updateAccount = async (accountId: string, amount: number): Promise<boolean> => {
  if (!accountId) throw new Error('accountId ID is required');

  const params = {
    TableName: ACCOUNTS_TABLE,
    Key: marshall({ id: accountId }),
    UpdateExpression: 'SET amount = if_not_exists(amount, :start) + :amount',
    ExpressionAttributeValues: {
      ':amount': { N: amount.toString() },
      ':start': { N: '0' },
    },
    ConditionExpression: 'attribute_exists(id)',
  };
  console.info('updateAccount - pre', params);

  const command = new UpdateItemCommand(params);
  await client.send(command);

  console.info('updateAccount - Success');

  return true;
};
