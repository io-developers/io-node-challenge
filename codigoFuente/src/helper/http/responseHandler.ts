import { APIGatewayProxyResult } from 'aws-lambda';

export const successResponse = (
  statusCode: number,
  data: any,
): APIGatewayProxyResult => ({
  statusCode,
  body: JSON.stringify({
    data,
  }),
});

export const errorResponse = (
  statusCode: number,
  message: string,
): APIGatewayProxyResult => ({
  statusCode,
  body: JSON.stringify({
    message,
  }),
});
