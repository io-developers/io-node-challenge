import * as lambda from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';
import { Table } from 'aws-cdk-lib/aws-dynamodb';
import { resolve } from 'node:path';
import { RetentionDays } from 'aws-cdk-lib/aws-logs';

type LambdasProps = {
  activityTable: Table;
  transactionsTable: Table;
  usersTable: Table;
}

export class Lambdas {
  public readonly checkUserFunction: lambda.Function;
  public readonly getTransactionsFunction: lambda.Function;
  public readonly processPaymentFunction: lambda.Function;
  public readonly registerActivityFunction: lambda.Function;
  public readonly paymentProcessorFunction: lambda.Function;

  constructor(scope: Construct, props: LambdasProps) {
    const lambdaCode = resolve(__dirname, '..', '..', '..', 'dist');

    this.checkUserFunction = new lambda.Function(scope, 'CheckUserFunction', {
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: 'lambda.checkUserHandler',
      code: lambda.Code.fromAsset(lambdaCode),
      environment: {
        USER_TABLE: props.usersTable.tableName,
        PAYMENT_PROCESSOR_URL: 'https://wwarlsw6l1.execute-api.us-east-1.amazonaws.com/dev/v1/payment-processor'
      },
      logRetention: RetentionDays.ONE_DAY,
    });

    this.getTransactionsFunction = new lambda.Function(scope, 'GetTransactionsFunction', {
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: 'lambda.getTransactionsHandler',
      code: lambda.Code.fromAsset(lambdaCode),
      environment: {
        TRANSACTION_TABLE: props.transactionsTable.tableName,
      },
      logRetention: RetentionDays.ONE_DAY,
    });

    this.processPaymentFunction = new lambda.Function(scope, 'ProcessPaymentFunction', {
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: 'lambda.executePaymentHandler',
      code: lambda.Code.fromAsset(lambdaCode),
      environment: {
        TRANSACTION_TABLE: props.transactionsTable.tableName,
      },
      logRetention: RetentionDays.ONE_DAY,
    });

    this.registerActivityFunction = new lambda.Function(scope, 'RegisterActivityFunction', {
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: 'lambda.handler',
      code: lambda.Code.fromAsset(lambdaCode),
      environment: {
        ACTIVITY_TABLE: props.activityTable.tableName,
      },
      logRetention: RetentionDays.ONE_DAY,
    });

    this.paymentProcessorFunction = new lambda.Function(scope, 'PaymentProcessorFunction', {
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: 'externalPaymentProcessor.handler',
      code: lambda.Code.fromAsset(lambdaCode),
      logRetention: RetentionDays.ONE_DAY,
    });

    props.usersTable.grantReadData(this.checkUserFunction);
    props.activityTable.grantReadWriteData(this.registerActivityFunction);
    props.transactionsTable.grantReadWriteData(this.processPaymentFunction);
    props.activityTable.grantReadWriteData(this.processPaymentFunction);
  }
}
