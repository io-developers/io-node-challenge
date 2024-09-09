import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as eventSources from 'aws-cdk-lib/aws-lambda-event-sources';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';

export class LambdaDynamodbStream extends Construct {
  constructor(
    scope: Construct,
    id: string,
    transactionsTable: dynamodb.Table,
    accountsTable: dynamodb.Table,
  ) {
    super(scope, id);

    const streamDynamoFunction = new NodejsFunction(this, 'StreamDynamoNodeJsFunction', {
      runtime: lambda.Runtime.NODEJS_20_X,
      description: 'Stream DynamoDB Function on transaction update',
      handler: 'handler',
      entry: `lib/services/payments/update-account/handler.ts`,
      environment: {
        ACCOUNTS_TABLE: accountsTable.tableName,
      },
    });

    accountsTable.grantReadWriteData(streamDynamoFunction);

    // Add a DynamoDB stream event source to the Lambda function
    streamDynamoFunction.addEventSource(
      new eventSources.DynamoEventSource(transactionsTable, {
        startingPosition: lambda.StartingPosition.TRIM_HORIZON, // Adjust based on your needs
      }),
    );
  }
}
