import * as lambda from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';

export class StfExecutePaymentLambda extends Construct {
  task1Function: NodejsFunction;

  task2Function: NodejsFunction;

  task3Function: NodejsFunction;

  constructor(scope: Construct, id: string) {
    super(scope, id);

    const task1Function = new NodejsFunction(this, 'Task1NodeJsFunction', {
      description: 'Task1',
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: 'handler',
      entry: `lib/contexts/payments/application/use-cases/task1.ts`,
    });

    const task2Function = new NodejsFunction(this, 'Task2NodeJsFunction', {
      description: 'Task2',
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: 'handler',
      entry: `lib/contexts/payments/application/use-cases/task2.ts`,
    });

    const task3Function = new NodejsFunction(this, 'Task3NodeJsFunction', {
      description: 'Task3',
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: 'handler',
      entry: `lib/contexts/payments/application/use-cases/task3.ts`,
    });

    this.task1Function = task1Function;
    this.task2Function = task2Function;
    this.task3Function = task3Function;
  }
}
