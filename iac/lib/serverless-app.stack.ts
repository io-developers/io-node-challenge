import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { DynamoTables } from './stack/dynamo-tables';
import { Lambdas } from './stack/lambdas';
import { StepFunctions } from './stack/step-functions';
import { ApiGateway } from './stack/api-gateway';
import { DynamoEventSource, SqsDlq } from 'aws-cdk-lib/aws-lambda-event-sources';
import { StartingPosition } from 'aws-cdk-lib/aws-lambda';
import { Queue } from 'aws-cdk-lib/aws-sqs';

export class ServerlessAppStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const dynamoTables = new DynamoTables(this);
    const lambdas = new Lambdas(this, {
      usersTable: dynamoTables.usersTable,
      transactionsTable: dynamoTables.transactionsTable,
      activityTable: dynamoTables.activityTable,
    });
    const stepFunctions = new StepFunctions(this, {
      usersTable: dynamoTables.usersTable,
      processPaymentFunction: lambdas.processPaymentFunction,
    });
    new ApiGateway(this, {
      stateMachine: stepFunctions.paymentStateMachine,
      getTransactionsHandler: lambdas.getTransactionsFunction,
      paymentProcessor: lambdas.paymentProcessorFunction,
    });

    lambdas.registerActivityFunction.addEventSource(new DynamoEventSource(dynamoTables.transactionsTable, {
      startingPosition: StartingPosition.TRIM_HORIZON,
      batchSize: 5,
      onFailure: new SqsDlq(new Queue(this, 'DLQ')),
    }));
  }
}
