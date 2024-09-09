import * as logs from 'aws-cdk-lib/aws-logs';
import * as sfn from 'aws-cdk-lib/aws-stepfunctions';
import * as tasks from 'aws-cdk-lib/aws-stepfunctions-tasks';
import { Construct } from 'constructs';

import { StfExecutePaymentLambda } from './StfExecutePaymentLambda';

export class StepFunctionExecutePayment extends Construct {
  stepFunctionExecutePayment: StfExecutePaymentLambda;

  usersStateMachine: sfn.StateMachine;

  constructor(scope: Construct, id: string, stepFunctionExecutePayment: StfExecutePaymentLambda) {
    super(scope, id);

    this.stepFunctionExecutePayment = stepFunctionExecutePayment;

    this.stepfunctions();
  }

  stepfunctions() {
    const getAccountTask = new tasks.LambdaInvoke(this, 'Task1-get-account', {
      lambdaFunction: this.stepFunctionExecutePayment.getAccountFunction,
      outputPath: '$',
      resultSelector: {
        'task1output.$': 'States.StringToJson($.Payload.body)',
      },
    });

    const executePaymentTask = new tasks.LambdaInvoke(this, 'Task2-execute-payment', {
      lambdaFunction: this.stepFunctionExecutePayment.executePaymentFunction,
      outputPath: '$',
      resultSelector: {
        'task2output.$': 'States.StringToJson($.Payload.body)',
      },
    });

    const saveTransactionTask = new tasks.LambdaInvoke(this, 'Task3-save-transaction', {
      lambdaFunction: this.stepFunctionExecutePayment.saveTransactionFunction,
      outputPath: '$',
      resultSelector: {
        'task3output.$': 'States.StringToJson($.Payload.body)',
      },
    });

    const failState = new sfn.Fail(this, 'Fail', {
      error: 'TaskFailed',
      cause: 'The task failed due to an invalid result',
    });

    const successState = new sfn.Succeed(this, 'Success', {
      outputPath: '$.task3output',
    });

    const isAccountValid = sfn.Condition.stringEquals('$.task1output.exists', 'Y');
    const isPaymentSuccess = sfn.Condition.stringEquals('$.task2output.payment_isok', 'Y');
    const isTransactionSuccess = sfn.Condition.stringEquals('$.task3output.transac_ok', 'Y');

    const saveTransactionSuccess = new sfn.Choice(this, 'Transaction Success?')
      .when(isTransactionSuccess, successState)
      .otherwise(failState);

    const paymentSuccess = new sfn.Choice(this, 'Payment Success?')
      .when(isPaymentSuccess, saveTransactionTask.next(saveTransactionSuccess))
      .otherwise(failState);

    const accountValid = new sfn.Choice(this, 'Account Valid?')
      .when(isAccountValid, executePaymentTask.next(paymentSuccess))
      .otherwise(failState);

    const definition = getAccountTask.next(accountValid);

    const logGroup = new logs.LogGroup(this, 'StateMachineLogGroup', {
      retention: logs.RetentionDays.ONE_WEEK,
    });

    this.usersStateMachine = new sfn.StateMachine(this, 'ExePaymentStateMachine', {
      definition,
      logs: {
        destination: logGroup,
        level: sfn.LogLevel.ALL,
        includeExecutionData: true,
      },
      stateMachineType: sfn.StateMachineType.EXPRESS,
    });
  }
}
