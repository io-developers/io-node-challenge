import { Construct } from 'constructs';

import { PaymentGateway } from './apigateway';
import { StfExecutePaymentLambda } from './lambdas';
import { StepFunctionExecutePayment } from './stepfunction';

export class PaymentStack extends Construct {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    // resources
    const lambdas = new StfExecutePaymentLambda(this, 'StfExecutePaymentLambda');
    const stepFunc = new StepFunctionExecutePayment(this, 'StepFunctionExecutePayment', lambdas);
    // eslint-disable-next-line no-new
    new PaymentGateway(this, 'PaymentGateway', stepFunc.usersStateMachine);
  }
}
