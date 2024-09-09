/* eslint-disable no-new */
import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';

import { Tables } from './intrastructure/Tables';
import { AccountFunctions } from './services/accounts/infrastructure/AccountFunctions';
import { AccountsGateway } from './services/accounts/infrastructure/AccountsGateway';
import { DomainName } from './services/core/DomainName';
import { LambdaDynamodbStream } from './services/payments/infrastructure/dynamostreams-lambda';
import { PaymentStack } from './services/payments/infrastructure/PaymentStack';

export class IoNodeChallengeStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const DOMAIN_NAME = process.env.DOMAIN_NAME || '';
    const domain = new DomainName(this, 'DomainName', DOMAIN_NAME);

    const tables = new Tables(this, 'Tables');

    new PaymentStack(
      this,
      'PaymentStack',
      domain.customDomain,
      tables.accountsTable,
      tables.transactionsTable,
    );

    new LambdaDynamodbStream(
      this,
      'LambdaDynamodbStream',
      tables.transactionsTable,
      tables.accountsTable,
    );

    const accountFunctions = new AccountFunctions(this, 'AccountFunctions', tables.accountsTable);

    new AccountsGateway(
      this,
      'AccountsGateway',
      accountFunctions.getAccountFunction,
      accountFunctions.getAccountsFunction,
      domain.customDomain,
    );
  }
}
