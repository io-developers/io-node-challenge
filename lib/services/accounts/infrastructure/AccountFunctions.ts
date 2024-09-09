import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';

export class AccountFunctions extends Construct {
  getAccountsFunction: NodejsFunction;

  getAccountFunction: NodejsFunction;

  constructor(scope: Construct, id: string, accountsTable: dynamodb.Table) {
    super(scope, id);

    const getAccountFunction = new NodejsFunction(this, 'GetAccountFunction', {
      description: 'get-account',
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: 'handler',
      entry: `lib/services/accounts/get-account/handler.ts`,
      environment: {
        ACCOUNTS_TABLE: accountsTable.tableName,
      },
    });
    accountsTable.grantReadData(getAccountFunction);

    const getAccountsFunction = new NodejsFunction(this, 'GetAccountsFunction', {
      description: 'get-accounts',
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: 'handler',
      entry: `lib/services/accounts/get-accounts/handler.ts`,
      environment: {
        ACCOUNTS_TABLE: accountsTable.tableName,
      },
    });
    accountsTable.grantReadData(getAccountsFunction);

    this.getAccountFunction = getAccountFunction;
    this.getAccountsFunction = getAccountsFunction;
  }
}
