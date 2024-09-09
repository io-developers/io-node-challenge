import { DynamoDBClient } from '@aws-sdk/client-dynamodb';

let client: DynamoDBClient;

// singleton
export const getClient = (): DynamoDBClient => {
  if (client) return client;
  client = new DynamoDBClient({});

  return client;
};
