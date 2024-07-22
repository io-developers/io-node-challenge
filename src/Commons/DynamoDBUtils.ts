import { DynamoDB } from 'aws-sdk';

const ACTIONS = {
  put: 'put',
  get: 'get',
  delete: 'delete',
  update: 'update',
  query: 'query',
  scan: 'scan',
};

export class DynamoDBUtils {

  static async callSingleOperation(action: string, params: any) {
    console.log('-- DynamoDBUtils.callSingleOperation --');
    try {
      const dynamoDb = new DynamoDB.DocumentClient();
      return await dynamoDb[action](params).promise();
    } catch (error) {
      console.log(error);
      throw new Error('Error calling DynamoDB');
    }
  }

  static async putItem(params: { TableName: string, Item: any }) {
    console.log('-- DynamoDBUtils.putItem --');
    return await this.callSingleOperation(ACTIONS.put, params);
  }

}