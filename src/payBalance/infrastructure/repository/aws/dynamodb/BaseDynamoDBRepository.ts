import { DocumentClient } from 'aws-sdk/clients/dynamodb';

export default abstract class BaseDynamoDBRepository<Entity, ModelDb> {
  protected tableName: string = '';

  private client: DocumentClient;

  constructor() {
    this.client = BaseDynamoDBRepository.getCLient();
  }

  public abstract toEntity(model: ModelDb): Entity;

  protected async query(params: object = {}) {
    const queryParams = {
      TableName: this.tableName,
      ...params,
    };

    return this.client
      .query(queryParams)
      .promise()
      .then(({ Items }) => {
        return Items.map(this.toEntity);
      })
      .catch((error) => {
        console.log(`Error al ejecutar query ${this.tableName} =>`, error);
        throw error;
      });
  }

  protected async update(row) {
    const updateParams = {
      TableName: this.tableName,
      Key: row.key,
      UpdateExpression: row.updateExpression,
      ExpressionAttributeValues: row.expresionValues,
    };

    return this.client.update(updateParams).promise();
  }

  static getCLient(): DocumentClient {
    return new DocumentClient({
      apiVersion: '2012-08-10',
      region: process.env.DEFAULT_REGION || 'us-east-2'
    });
  }
}
