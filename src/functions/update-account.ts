import { DynamoDB } from 'aws-sdk';

const dynamoDb = new DynamoDB.DocumentClient();
const accountsTable = process.env.ACCOUNTS_TABLE || '';

export const handler = async (event) => {
  try{
      for (const record of event.Records) {
        const { accountId, amount } = record.dynamodb.NewImage.data.M;

        // Actualiza el saldo de la cuenta en la tabla Accounts
        await dynamoDb.update({
          TableName: accountsTable,
          Key: { id: accountId.S },
          UpdateExpression: 'set amount = amount + :val',
          ExpressionAttributeValues: {
            ':val': Number(amount.N),
          },
        }).promise();
      }
    } catch (error) {
      console.error("Update account error: ", error);
    }
};