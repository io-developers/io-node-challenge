import * as lambda from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';
import { resolve } from 'node:path';
import { RetentionDays } from 'aws-cdk-lib/aws-logs';

export class Lambdas {
  public readonly getTransactionsFunction: lambda.Function;
  public readonly getUserFunction: lambda.Function;
  public readonly processPaymentFunction: lambda.Function;
  public readonly registerActivityFunction: lambda.Function;
  public readonly paymentProcessorFunction: lambda.Function;

  constructor(scope: Construct) {
    const lambdaCode = resolve(__dirname, '..', '..', '..', 'dist');

    this.getTransactionsFunction = new lambda.Function(scope, 'GetTransactionsFunction', {
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: 'lambda.getTransactionsHandler',
      code: lambda.Code.fromAsset(lambdaCode),
      logRetention: RetentionDays.ONE_DAY,
    });

    this.getUserFunction = new lambda.Function(scope, 'GetUserFunction', {
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: 'lambda.getUserHandler',
      code: lambda.Code.fromAsset(lambdaCode),
      logRetention: RetentionDays.ONE_DAY,
    });

    this.paymentProcessorFunction = new lambda.Function(scope, 'PaymentProcessorFunction', {
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: 'lambda.paymentProcessorHandler',
      code: lambda.Code.fromAsset(lambdaCode),
      logRetention: RetentionDays.ONE_DAY,
    });

    this.processPaymentFunction = new lambda.Function(scope, 'ProcessPaymentFunction', {
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: 'lambda.executePaymentHandler',
      code: lambda.Code.fromAsset(lambdaCode),
      logRetention: RetentionDays.ONE_DAY,
    });

    this.registerActivityFunction = new lambda.Function(scope, 'RegisterActivityFunction', {
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: 'lambda.registerActivityHandler',
      code: lambda.Code.fromAsset(lambdaCode),
      logRetention: RetentionDays.ONE_DAY,
    });
  }
}
