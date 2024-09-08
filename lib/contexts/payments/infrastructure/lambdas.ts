import * as lambda from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';

export class StfExecutePaymentLambda extends Construct {
  getAccountFunction: NodejsFunction;

  executePaymentFunction: NodejsFunction;

  saveTransactionFunction: NodejsFunction;

  constructor(scope: Construct, id: string) {
    super(scope, id);

    const getAccountFunction = new NodejsFunction(this, 'GetAccountFunction', {
      description: 'Task1 - get-account',
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: 'handler',
      entry: `lib/contexts/payments/application/use-cases/get-account.ts`,
    });

    const executePaymentFunction = new NodejsFunction(this, 'ExecutePaymentFunction', {
      description: 'Task2 - execute-payment',
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: 'handler',
      entry: `lib/contexts/payments/application/use-cases/execute-payment.ts`,
    });

    const saveTransactionFunction = new NodejsFunction(this, 'SaveTransactionFunction', {
      description: 'Task3 - save-transaction',
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: 'handler',
      entry: `lib/contexts/payments/application/use-cases/save-transaction.ts`,
    });

    this.getAccountFunction = getAccountFunction;
    this.executePaymentFunction = executePaymentFunction;
    this.saveTransactionFunction = saveTransactionFunction;
  }
}
