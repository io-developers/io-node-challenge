import { DynamoDB } from 'aws-sdk';

const dynamoDb = new DynamoDB.DocumentClient();
const accountsTable = process.env.ACCOUNTS_TABLE || '';

export const handler = async (event) => {
  try{
      const { accountId } = JSON.parse(event.body || '{}');

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
      console.debug("Validate-account: ", params);
      const result = await dynamoDb.get(params).promise();

      if (!result.Item) {
        return {
          statusCode: 404,
          body: JSON.stringify({ message: 'Account not found' }),
        };
      }

      return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Account validated' }),
      };
  } catch (error) {
    console.error("Validate account error: ", error);
  }
};