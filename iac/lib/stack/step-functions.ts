import * as sfn from 'aws-cdk-lib/aws-stepfunctions';
import * as tasks from 'aws-cdk-lib/aws-stepfunctions-tasks';
import { Construct } from 'constructs';
import { Function } from 'aws-cdk-lib/aws-lambda';
import { Table } from 'aws-cdk-lib/aws-dynamodb';

type StepFunctionsProps = {
  usersTable: Table;
  processPaymentFunction: Function;
}

export class StepFunctions {
  public readonly paymentStateMachine: sfn.StateMachine;

  constructor(scope: Construct, props: StepFunctionsProps) {
    const checkUserTask = new tasks.DynamoGetItem(scope, 'Check User in DynamoDB', {
      table: props.usersTable,
      key: {
        userId: tasks.DynamoAttributeValue.fromString(sfn.JsonPath.stringAt('$.userId')),
      },
      resultPath: '$.Result',
    });

    const processPaymentTask = new tasks.LambdaInvoke(scope, 'Process Payment', {
      lambdaFunction: props.processPaymentFunction,
      outputPath: '$.Payload',
    });

    const retrieveOriginalPayloadTask = new sfn.Pass(scope, 'Modify Payment Result', {
      parameters: {
        'userId.$': '$.Payload.userId',
        'amount.$': '$.Payload.amount',
      },
      resultPath: '$.Payload',
    });
  
    const userExistsChoice = new sfn.Choice(scope, 'User Exists?')
      .when(sfn.Condition.isPresent('$.Result.Item'), processPaymentTask)
      .otherwise(new sfn.Fail(scope, 'User Not Found', {
        error: 'UserNotFound',
        cause: 'The specified user does not exist.',
      }));

    this.paymentStateMachine = new sfn.StateMachine(scope, 'PaymentStateMachine', {
      definition: checkUserTask.next(retrieveOriginalPayloadTask).next(userExistsChoice),
    });
  }
}
