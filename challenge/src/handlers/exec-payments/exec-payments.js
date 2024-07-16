const dynamodb = require('../../db/db');
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');

exports.executePayments = async (event) => {
  /**
   * En caso el usuario exista, un lambda llamado execute-payments debe llamar a un API Mock que 
   * el postulante debe crear, el cual debe de regresar una transacción exitosa
   */

  const { userId, amount } = JSON.parse(event.body);

  try {
    const response = await axios.post('http://localhost:8001/payments', {
      userId,
      amount,
    });

    if (response.data.status === 'success') {
      const transactionId = response.data.transactionId;
      const params = {
        TableName: 'transactions',
        Item: {
          transactionId: transactionId,
          userId,
          amount,
          status: 'success',
        },
      };

      await dynamodb.put(params).promise();

      return {
        statusCode: 201,
        body: JSON.stringify({
          message: 'Payment registered successfully',
          transactionId: transactionId,
        }),
      };
    } else {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Something was wrong' }),
      };
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal Server Error', error: error.message }),
    };
  }
};