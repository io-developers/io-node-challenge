import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';
import { StateMachine } from 'aws-cdk-lib/aws-stepfunctions';
import { Role} from 'aws-cdk-lib/aws-iam';

type ApiGatewayProps = {
  getTransactionsHandler: lambda.Function;
  getUserHandler: lambda.Function;
  paymentProcessor: lambda.Function;
  stateMachine: StateMachine;
}

export class ApiGateway {
  public readonly api: apigateway.RestApi;

  constructor(scope: Construct) {
    this.api = new apigateway.RestApi(scope, 'PaymentsApi', {
      restApiName: 'Payments Service',
      deployOptions: {
        stageName: 'dev',
      }
    });
  }

  setupApiGateway(role: Role, props: ApiGatewayProps) {
    const v1 = this.api.root.addResource('v1');
    const paymentProcessor = v1.addResource('payment-processor');
    const payments = v1.addResource('payments');
    const transactions = v1.addResource('transactions');
    const users = v1.addResource('users');

    payments.addMethod('POST', new apigateway.AwsIntegration({
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
    }), {
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

    users.addMethod('GET', new apigateway.LambdaIntegration(props.getUserHandler), {
      methodResponses: [{
        statusCode: '200',
      }],
    });
  }
}
