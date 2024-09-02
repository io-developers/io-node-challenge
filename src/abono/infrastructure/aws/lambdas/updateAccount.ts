import {DynamoDB} from 'aws-sdk';
import {Logger} from '@aws-lambda-powertools/logger';

const dynamoDb = new DynamoDB.DocumentClient();
const ACCOUNTS_TABLE = process.env.ACCOUNTS_TABLE!;
const logger = new Logger();

export const handler = async (event: any) => {

  logger.info('Received event:', {event});

  try {
    // Obtener la transacción del evento de DynamoDB Streams
    const records = event.Records.map((record: any) => DynamoDB.Converter.unmarshall(record.dynamodb.NewImage));

    for (const record of records) {
      const {accountId, amount} = record;

      // Actualizar el saldo de la cuenta en la tabla de accounts
      await dynamoDb.update({
        TableName: ACCOUNTS_TABLE,
        Key: {id: accountId},
        UpdateExpression: "set balance = balance + :amount",
        ExpressionAttributeValues: {":amount": amount},
      }).promise();

      logger.info('Account balance updated', {accountId, amount});
    }

    return {status: 'Account balance updated successfully'};
  } catch (error) {
    logger.error('Error updating account balance', {error: error.message});
    throw error;
  }
};
