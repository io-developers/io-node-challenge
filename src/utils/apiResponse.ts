import { APIGatewayProxyResult } from 'aws-lambda';

export const apiResponse = (statusCode: number, body: object): APIGatewayProxyResult => {
  return {
    statusCode,
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
    },
  };
};
