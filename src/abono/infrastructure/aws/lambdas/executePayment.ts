import {DynamoDB} from 'aws-sdk';
import axios from 'axios';
import {Logger} from '@aws-lambda-powertools/logger';

const dynamoDb = new DynamoDB.DocumentClient();
const USERS_TABLE = process.env.USERS_TABLE;
const API_MOCK_URL = process.env.API_MOCK_URL;
const logger = new Logger();

export const handler = async (event: any) => {
  const {userId, amount} = event;

  logger.info('Evento recibido:', {event});

  // Validar usuario y se asume que exista tambien la cuenta con saldo.
  try {
    const user = await dynamoDb.get({
      TableName: USERS_TABLE!,
      Key: {id: userId}
    }).promise();

    if (!user.Item) {
      logger.error('User not found', {userId});
      throw new Error('User not found');
    }

    logger.info('User found:', {user});

    // Llamar a la API Mock para procesar el pago
    const response = await axios.post(`${API_MOCK_URL}/process-payment`, {
      userId,
      amount
    });

    logger.info('Payment processed successfully', {transactionId: response.data.transactionId});

    if (response.data.status !== 'success') {
      logger.error('Payment failed', {responseData: response.data});
      throw new Error('Payment failed');
    }

    // Retornar la transacción para la siguiente tarea en el Step Function
    return {
      status: 'SUCCESS',
      transactionId: response.data.transactionId
    };
  } catch (error) {
    logger.error('Error processing payment', {error: error.message});
    throw error;
  }
};
