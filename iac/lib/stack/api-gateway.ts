import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';
import { StateMachine } from 'aws-cdk-lib/aws-stepfunctions';
import { Role, ServicePrincipal, PolicyStatement } from 'aws-cdk-lib/aws-iam';

type ApiGatewayProps = {
  getTransactionsHandler: lambda.Function;
  paymentProcessor: lambda.Function;
  stateMachine: StateMachine;
}

export class ApiGateway {
  constructor(scope: Construct, props: ApiGatewayProps) {
    const api = new apigateway.RestApi(scope, 'PaymentsApi', {
      restApiName: 'Payments Service',
      deployOptions: {
        stageName: 'dev',
      }
    });

    const role = new Role(scope, 'ApiGatewayStepFunctionsRole', {
      assumedBy: new ServicePrincipal('apigateway.amazonaws.com'),
    });

    role.addToPolicy(new PolicyStatement({
      actions: ['states:StartSyncExecution'],
      resources: [props.stateMachine.stateMachineArn],
    }));

    const v1 = api.root.addResource('v1');
    const paymentProcessor = v1.addResource('payment-processor');
    const payments = v1.addResource('payments');
    const transactions = v1.addResource('transactions');
    const integration = new apigateway.AwsIntegration({
      service: 'states',
      action: 'StartSyncExecution',
      options: {
        credentialsRole: role,
        requestTemplates: {
          'application/json': JSON.stringify({
            input: "$util.escapeJavaScript($input.body)",
            stateMachineArn: props.stateMachine.stateMachineArn,
          }),
        },
        integrationResponses: [{
          statusCode: '200',
        }],
      },
    });

    payments.addMethod('POST', integration, {
      methodResponses: [{
        statusCode: '200',
      }],
    });

    paymentProcessor.addMethod('POST', new apigateway.LambdaIntegration(props.paymentProcessor), {
      methodResponses: [{
        statusCode: '200',
      }],
    });

    transactions.addMethod('GET', new apigateway.LambdaIntegration(props.getTransactionsHandler), {
      methodResponses: [{
        statusCode: '200',
      }],
    });
  }
}
