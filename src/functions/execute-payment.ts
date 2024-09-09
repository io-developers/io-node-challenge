import { DynamoDB } from 'aws-sdk';
import axios from 'axios';// para hacer solicitudes HTTP
import { v4 as uuidv4 } from 'uuid';

const dynamoDb = new DynamoDB.DocumentClient();
const transactionsTable = process.env.TRANSACTION_TABLE || '';

export const handler = async (event) => {
    try {
    const { accountId, amount } = JSON.parse(event.body || '{}');
    console.debug("Initialize handler execute payments", accountId);

    // Validación básica de los parámetros de entrada
    if (!accountId || !amount) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Invalid request. Missing parameters.' }),
      };
    }

    // Llamar al API Mock que simula la pasarela de pagos
    const paymentResponse = await axios.post(
      `${process.env.MOCK_API_URL}`,
      JSON.stringify({ accountId, amount }),
      {      
        headers: { 'Content-Type': 'application/json' },
      }
    );

    const paymentResult = await paymentResponse.data;
    if (paymentResponse.status === 200) {
      // Generar el ID único para la transacción
      const transactionId = uuidv4();
      const transaction = {
        source: transactionId,
        id: Date.now(),
        data: { accountId, amount },
      };
      // Guardar la transacción en DynamoDB
      await dynamoDb.put({
        TableName: transactionsTable,
        Item: transaction,
      }).promise();

      return {
        statusCode: 201,
        body: JSON.stringify({
          message: 'Payment registered successfully',
          transactionId: transactionId,
        }),
      };
    }

    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Payment failed' }),
    };
  } catch (error) {
    console.error("Error execute payments: ", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal server error', error: error.message }),
    };
  }
};