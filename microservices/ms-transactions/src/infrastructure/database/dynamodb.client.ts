import { DynamoDB } from 'aws-sdk';

const options = {
  region: "us-east-1",
};

export const dynamoDbClient = new DynamoDB.DocumentClient(options);
