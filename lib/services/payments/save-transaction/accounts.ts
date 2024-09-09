import { PutItemCommand } from '@aws-sdk/client-dynamodb';
import { marshall } from '@aws-sdk/util-dynamodb';
import { v4 } from 'uuid';

import { TRANSACTIONS_TABLE } from '../../common/constants';
import { getClient } from '../../common/dynamodb';
import { Account } from '../../common/types';

const client = getClient();

type Transaction = {
  source: string;
  id: Account['id'];
  data: {
    accountId: Account['id'];
    amount: number;
  };
};

export const saveTransaction = async (accountId: string, amount: number): Promise<string> => {
  if (!accountId) throw new Error('accountId ID is required');

  const newTransaction: Transaction = {
    source: v4(),
    id: accountId,
    data: {
      accountId,
      amount,
    },
  };

  console.info('saveTransaction - Saving transaction', newTransaction);

  const params = {
    TableName: TRANSACTIONS_TABLE,
    Item: marshall(newTransaction),
  };

  await client.send(new PutItemCommand(params));

  console.info('saveTransaction - Success');

  return newTransaction.source;
};
