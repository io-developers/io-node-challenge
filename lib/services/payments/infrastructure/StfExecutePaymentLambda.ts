import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';

import { MP_ACCESS_TOKEN, MP_PUBLIC_KEY, PAYER_EMAIL, PAYER_ID } from '../../common/constants';

export class StfExecutePaymentLambda extends Construct {
  getAccountFunction: NodejsFunction;

  executePaymentFunction: NodejsFunction;

  saveTransactionFunction: NodejsFunction;

  constructor(
    scope: Construct,
    id: string,
    accountsTable: dynamodb.Table,
    transactionsTable: dynamodb.Table,
  ) {
    super(scope, id);

    const getAccountFunction = new NodejsFunction(this, 'GetAccountFunction', {
      description: 'Task1 - get-account',
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: 'handler',
      entry: `lib/services/payments/get-account/handler.ts`,
      environment: {
        ACCOUNTS_TABLE: accountsTable.tableName,
      },
    });
    accountsTable.grantReadData(getAccountFunction);

    const executePaymentFunction = new NodejsFunction(this, 'ExecutePaymentFunction', {
      description: 'Task2 - execute-payment',
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: 'handler',
      entry: `lib/services/payments/execute-payment/handler.ts`,
      environment: {
        MP_PUBLIC_KEY,
        MP_ACCESS_TOKEN,
        PAYER_ID,
        PAYER_EMAIL,
      },
    });

    const saveTransactionFunction = new NodejsFunction(this, 'SaveTransactionFunction', {
      description: 'Task3 - save-transaction',
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: 'handler',
      entry: `lib/services/payments/save-transaction/handler.ts`,
      environment: {
        TRANSACTIONS_TABLE: transactionsTable.tableName,
      },
    });
    transactionsTable.grantReadWriteData(saveTransactionFunction);

    this.getAccountFunction = getAccountFunction;
    this.executePaymentFunction = executePaymentFunction;
    this.saveTransactionFunction = saveTransactionFunction;
  }
}
