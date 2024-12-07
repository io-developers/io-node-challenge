const dynamodb = require('../../db/db');

exports.getTransaction = async (event) => {
  /**
   * Consultar por el id de transacción desde el lambda get-transaction en la tabla transactions
   */
  const transactionId = event.queryStringParameters.transaction_id;

  const params = {
    TableName: 'transactions',
    Key: { transactionId },
  }

  try {
    const result = await dynamodb.get(params).promise();
    if (result.Item) {
      /**
       * En caso la transacción exista, debe de regresar el registro de la transacción
       */
      return {
        statusCode: 200,
        body: JSON.stringify(result.Item),
      };
    } else {
      /**
       * En caso la transacción no exista, debe de regresar una respuesta con el mensaje "Usuario no encontrado"
       */
      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'Transacción no encontrado' }),
      };
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error interno del servidor', error: error.message }),
    };
  }
}