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

  static async callSingleOperation(action: string, params: any)  {
    console.log('-- DynamoDBUtils.callSingleOperation --');
    console.log({ action, params });
    try {
      const dynamoDb = new DynamoDB.DocumentClient();
      return dynamoDb[action](params).promise();
    } catch (error) {
      console.log(error);
      throw new Error('Error calling DynamoDB');
    }
  }

  static async putItem(params: { TableName: string, Item: any }): Promise<boolean> {
    console.log('-- DynamoDBUtils.putItem --');
    return await this.callSingleOperation(ACTIONS.put, params).then((data) => {
      console.log({ data });
      if (data) {
        return true;
      } else {
        return false;
      };
    });
  }

  static async getItem(params: { TableName: string, Key: any }): Promise<any> {
    console.log('-- DynamoDBUtils.getItem --');
    return await this.callSingleOperation(ACTIONS.get, params).then((data) => {
      console.log({ data });
      return data.Item;
    });
  }

}