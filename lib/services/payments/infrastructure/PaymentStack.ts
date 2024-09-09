/* eslint-disable no-new */
import * as apiGateway from 'aws-cdk-lib/aws-apigateway';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import { Construct } from 'constructs';

import { PaymentGateway } from './PaymentGateway';
import { StepFunctionExecutePayment } from './StepFunctionExecutePayment';
import { StfExecutePaymentLambda } from './StfExecutePaymentLambda';

export class PaymentStack extends Construct {
  constructor(
    scope: Construct,
    id: string,
    version: apiGateway.IResource,
    accountsTable: dynamodb.Table,
    transactionsTable: dynamodb.Table,
  ) {
    super(scope, id);

    // resources
    const lambdas = new StfExecutePaymentLambda(
      this,
      'StfExecutePaymentLambda',
      accountsTable,
      transactionsTable,
    );

    const stepFunc = new StepFunctionExecutePayment(this, 'StepFunctionExecutePayment', lambdas);

    new PaymentGateway(this, 'PaymentGateway', stepFunc.usersStateMachine, version);
  }
}
