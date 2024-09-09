import { ScanCommand } from '@aws-sdk/client-dynamodb';

import { ACCOUNTS_TABLE } from '../common/constants';
import { getClient } from '../common/dynamodb';
import { Account } from '../common/types';

const client = getClient();

export const getAccounts = async (): Promise<Account[]> => {
  const params = {
    TableName: ACCOUNTS_TABLE,
  };
  console.info('getAccounts - pre', params);

  const command = new ScanCommand(params);
  const data = await client.send(command);

  const accounts: Account[] = data.Items ? (data.Items as unknown as Account[]) : [];

  console.info(`getAccounts - Success length: ${accounts.length}`);

  return accounts;
};
