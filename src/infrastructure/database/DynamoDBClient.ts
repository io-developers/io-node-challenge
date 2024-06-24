import { DynamoDB } from 'aws-sdk';

const options = {
  region: process.env.AWS_REGION,
};

const client = new DynamoDB.DocumentClient(options);

export default client;
