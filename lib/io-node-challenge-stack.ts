import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';

import { PaymentStack } from './contexts/payments/infrastructure';

export class IoNodeChallengeStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // eslint-disable-next-line no-new
    new PaymentStack(this, 'PaymentStack');
  }
}
