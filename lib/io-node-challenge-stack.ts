/* eslint-disable no-new */
import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';

import { DomainName } from './contexts/core';
import { PaymentStack } from './contexts/payments/infrastructure';

export class IoNodeChallengeStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const DOMAIN_NAME = process.env.DOMAIN_NAME || '';
    const domain = new DomainName(this, 'DomainName', DOMAIN_NAME);

    new PaymentStack(
      this,
      'PaymentStack',
      domain.hostedZone,
      domain.apicertificate,
      domain.domainName,
    );
  }
}
