
export const handler = async (event) => {
  const body = JSON.parse(event.body || '{}');

  // Validación de parámetros
  if (body.accountId && body.amount) {
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Transaction successful',
        transactionId: '8db0a6fc-ad42-4974-ac1f-36bb90730afe',
      }),
    };
  }

  return {
    statusCode: 400,
    body: JSON.stringify({ message: 'Payment failed' }),
  };
};