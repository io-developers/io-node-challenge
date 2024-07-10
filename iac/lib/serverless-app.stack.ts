import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { DynamoTables } from './stack/dynamo-tables';
import { Lambdas } from './stack/lambdas';
import { StepFunctions } from './stack/step-functions';
import { ApiGateway } from './stack/api-gateway';
import { DynamoEventSource, SqsDlq } from 'aws-cdk-lib/aws-lambda-event-sources';
import { StartingPosition } from 'aws-cdk-lib/aws-lambda';
import { Queue } from 'aws-cdk-lib/aws-sqs';
import { PolicyDocument, PolicyStatement, Role, ServicePrincipal } from 'aws-cdk-lib/aws-iam';

export class ServerlessAppStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const dynamoTables = new DynamoTables(this);
    const lambdas = new Lambdas(this);
    const stepFunctions = new StepFunctions(this, {
      usersTable: dynamoTables.usersTable,
      processPaymentFunction: lambdas.processPaymentFunction,
    });
    const apiGateway = new ApiGateway(this);
    const apigatewayRole = new Role(this, 'ApiGatewayStepFunctionsRole', {
      assumedBy: new ServicePrincipal('apigateway.amazonaws.com'),
      inlinePolicies: {
        startSyncExecutionPolicy: new PolicyDocument({
          statements: [
            new PolicyStatement({
              actions: ['states:StartSyncExecution'],
              resources: [stepFunctions.paymentStateMachine.stateMachineArn],
            }),
          ],
        }),
      }
    });

    apiGateway.setupApiGateway(apigatewayRole, {
      getTransactionsHandler: lambdas.getTransactionsFunction,
      getUserHandler: lambdas.getUserFunction,
      paymentProcessor: lambdas.paymentProcessorFunction,
      stateMachine: stepFunctions.paymentStateMachine,
    });

    dynamoTables.grantPermissions(lambdas);

    // Add environment variables to the lambdas
    lambdas.getTransactionsFunction.addEnvironment('TRANSACTION_TABLE', dynamoTables.transactionsTable.tableName);
    lambdas.getUserFunction.addEnvironment('USER_TABLE', dynamoTables.usersTable.tableName);
    lambdas.paymentProcessorFunction.addEnvironment('PAYMENT_PROCESSOR_URL','https://9ateosf7cj.execute-api.us-east-1.amazonaws.com/dev');
    lambdas.paymentProcessorFunction.addEnvironment('TRANSACTION_TABLE', dynamoTables.transactionsTable.tableName);
    lambdas.registerActivityFunction.addEnvironment('ACTIVITY_TABLE', dynamoTables.activityTable.tableName);

    // Add event sources to the lambdas
    lambdas.registerActivityFunction.addEventSource(new DynamoEventSource(dynamoTables.transactionsTable, {
      startingPosition: StartingPosition.TRIM_HORIZON,
      batchSize: 5,
      onFailure: new SqsDlq(new Queue(this, 'DLQ')),
    }));
  }
}
