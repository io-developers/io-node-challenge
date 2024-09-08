import * as sfn from 'aws-cdk-lib/aws-stepfunctions';
import * as tasks from 'aws-cdk-lib/aws-stepfunctions-tasks';
import { Construct } from 'constructs';

import { StfExecutePaymentLambda } from './lambdas';

export class StepFunctionExecutePayment extends Construct {
  stepFunctionExecutePayment: StfExecutePaymentLambda;

  usersStateMachine: sfn.StateMachine;

  constructor(scope: Construct, id: string, stepFunctionExecutePayment: StfExecutePaymentLambda) {
    super(scope, id);

    this.stepFunctionExecutePayment = stepFunctionExecutePayment;

    this.stepfunctions();
  }

  stepfunctions() {
    const task1 = new tasks.LambdaInvoke(this, 'Task1-get-account', {
      lambdaFunction: this.stepFunctionExecutePayment.getAccountFunction,
      outputPath: '$.Payload',
    });

    const task2 = new tasks.LambdaInvoke(this, 'Task2-execute-payment', {
      lambdaFunction: this.stepFunctionExecutePayment.executePaymentFunction,
      outputPath: '$.Payload',
    });

    const task3 = new tasks.LambdaInvoke(this, 'Task3-save-transaction', {
      lambdaFunction: this.stepFunctionExecutePayment.saveTransactionFunction,
      outputPath: '$.Payload',
    });

    const parseBody = new sfn.Pass(this, 'ParseBody', {
      parameters: {
        'body.$': 'States.StringToJson($.body)',
      },
    });

    const choiceState = new sfn.Choice(this, 'ChoiceState');

    choiceState
      .when(sfn.Condition.stringEquals('$.body.status', 'SUCCESS'), task2)
      .when(sfn.Condition.stringEquals('$.body.status', 'FAILED'), task3)
      .otherwise(
        new sfn.Fail(this, 'FailState', {
          cause: 'Invalid status',
          error: 'InvalidStatusError',
        }),
      );

    const definition = task1.next(parseBody).next(choiceState);

    // const definition = sfn.DefinitionBody.fromChainable(
    //   new sfn.Map(this, 'For each SOAP generation request', {
    //     itemsPath: '$.Execution.Input',
    //   }).itemProcessor(task1.next(parseBody).next(task2).next(task3)),
    // );

    this.usersStateMachine = new sfn.StateMachine(this, 'ExePaymentStateMachine', {
      definition,
    });
  }
}
