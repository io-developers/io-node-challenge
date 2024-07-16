const dynamodb = require('../../db/db');

exports.validateUser = async (event) => {
  /**
   * Validar el id de usuario comparándolo en la tabla users
   */
  const { userId } = JSON.parse(event.body);

  const params = {
    TableName: 'users',
    Key: {
      userId: userId,
    },
  };

  try {
    const result = await dynamodb.get(params).promise();
    if (result.Item) {
      return {
        statusCode: 200,
        body: JSON.stringify({ message: 'User exists' }),
      };
    } else {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'User not found' }),
      };
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal Server Error', error: error.message }),
    };
  }
};