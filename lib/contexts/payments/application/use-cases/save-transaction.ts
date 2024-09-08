import { APIGatewayProxyHandler } from 'aws-lambda';

export const handler: APIGatewayProxyHandler = async (event: any) => {
  console.info('Event:', event, typeof event);
  // Lógica en caso de fallo
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Task3 ejecutada correctamente en caso de FAILED',
    }),
  };
};
