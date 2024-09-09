import { QueryCommand } from '@aws-sdk/client-dynamodb';

import { ACCOUNTS_TABLE } from './constants';
import { getClient } from './dynamodb';
import { Account } from './types';

const client = getClient();

const mapper = (Items: any): Account | null => {
  if (!Items || Items.length === 0) {
    return null;
  }
  const item = Items[0];

  return {
    id: item.id.S,
    person_name: item.person_name.S,
    picture: item.picture.S,
    card_id: item.card_id.S,
    security_code: item.security_code.S,
    amount: parseFloat(item.amount.N),
  };
};

export const getAccountById = async (accountId: string): Promise<Account | null> => {
  if (!accountId) throw new Error('accountId ID is required');

  const { Items } = await client.send(
    new QueryCommand({
      TableName: ACCOUNTS_TABLE,
      ProjectionExpression: `id, person_name, picture, card_id, security_code, amount`,
      KeyConditionExpression: 'id = :pk',
      ExpressionAttributeValues: {
        ':pk': { S: `${accountId}` },
      },
    }),
  );

  console.info('getAccountById.Items', Items ? JSON.stringify(Items) : 'No Items');

  const response = mapper(Items);

  return response;
};
