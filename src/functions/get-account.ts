import { DynamoDB } from 'aws-sdk';

const dynamoDb = new DynamoDB.DocumentClient();
const accountsTable = process.env.ACCOUNTS_TABLE || '';

export const handler = async (event) => {
  const accountId = event.pathParameters?.accountId;

  if (!accountId) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Account ID is required' }),
    };
  }

  const params = {
    TableName: accountsTable,
    Key: { id: accountId },
  };

  try {
    const result = await dynamoDb.get(params).promise();

    if (!result.Item) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'Account not found' }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify(result.Item),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal server error', error: error.message }),
    };
  }
};