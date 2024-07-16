const AWS = require('aws-sdk');

const awsConfig = {
  region: 'localhost',
  accessKeyId: 'MockAccessKeyId',
  secretAccessKey: 'MockSecretAccessKey',
  endpoint: 'http://0.0.0.0:8000',
}

const client = new AWS.DynamoDB.DocumentClient(awsConfig);

module.exports = client;