import { APIGatewayProxyHandler } from 'aws-lambda';

export const handler: APIGatewayProxyHandler = async (event: any) => {
  console.log('Event:', event, typeof event);
  // Lógica en caso de éxito
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Task2 ejecutada correctamente en caso de SUCCESS',
    }),
  };
};
