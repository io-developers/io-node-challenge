import { DynamoDB } from 'aws-sdk';

const options = {
  region: process.env.AWS_REGION,
  endpoint: process.env.DYNAMODB_ENDPOINT,
};

const dynamoDb = new DynamoDB.DocumentClient(options);

export default dynamoDb;
