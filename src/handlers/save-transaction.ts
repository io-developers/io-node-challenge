import { DynamoDB } from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';

const dynamoDb = new DynamoDB.DocumentClient();
const transactionsTable = process.env.TRANSACTION_TABLE || '';

export const handler = async (event) => {
  const missingParameters = "Invalid request. Missing parameters.";
  try{
      console.debug("Initialize handler save transaction");

      const { accountId, amount } = JSON.parse(event.body || '{}');
      if (!accountId || !amount) throw new Error(missingParameters);
      const transactionId = uuidv4();

      const transaction = {
        source: transactionId,
        id: Date.now(),
        data: { accountId, amount },
      };
      console.debug("Input transaction: ", transaction);
      await dynamoDb.put({
        TableName: transactionsTable,
        Item: transaction,
      }).promise();

      return {
        statusCode: 201,
        body: JSON.stringify({
          message: 'Transaction saved successfully',
          transactionId,
        }),
      };

  } catch (error) {
    console.error("Problems to process transaction: ", error);
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: (error.message.includes(missingParameters)? missingParameters: 'Invalid request. Could not parse JSON.'),
        transactionId: "",
      }),
    };
  }
};