/* eslint-disable no-new */
import * as apiGateway from 'aws-cdk-lib/aws-apigateway';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as sfn from 'aws-cdk-lib/aws-stepfunctions';
import { Construct } from 'constructs';

export class PaymentGateway extends Construct {
  constructor(
    scope: Construct,
    id: string,
    usersStateMachine: sfn.StateMachine,
    customDomain: apiGateway.DomainName,
  ) {
    super(scope, id);

    const api = new apiGateway.RestApi(this, 'PaymentApi', {
      restApiName: 'Payment API',
      description: 'Backend - Payment API',
    });

    new apiGateway.BasePathMapping(this, 'PaymentApi-mapping', {
      domainName: customDomain,
      restApi: api,
      basePath: 'payments', // Path base para esta API
    });

    // Permisos para que API Gateway pueda invocar la Step Function
    const role = new iam.Role(this, 'ApiGatewayStepFunctionsRole', {
      assumedBy: new iam.ServicePrincipal('apigateway.amazonaws.com'),
    });

    usersStateMachine.grantStartSyncExecution(role);
    usersStateMachine.grantRead(role);

    const stepFunctionIntegration = new apiGateway.AwsIntegration({
      service: 'states',
      action: 'StartSyncExecution',
      integrationHttpMethod: 'POST',
      options: {
        credentialsRole: role,
        integrationResponses: [
          {
            statusCode: '200',
            responseTemplates: {
              'application/json': `
               #set($context.responseOverride.header.Content-Type = "application/json")
                
                #set($inputRoot = $input.path('$'))
                #if($inputRoot.status == "SUCCEEDED")
                  #set($message = $output.message)
                  #set($transactionId = $output.transactionId)
                  #if($inputRoot.output && $inputRoot.output != "{}")
                    $inputRoot.output
                  #else
                    {"message": "Step Function completed successfully"}
                  #end
                #elseif($inputRoot.status == "FAILED")
                  {
                    "error": "Step Function execution failed",
                    "cause": "$util.escapeJavaScript($inputRoot.cause)"
                  }
                #else
                  {
                    "error": "Unexpected response",
                    "response": $input.json('$')
                  }
                #end`,
            },
          },
        ],
        requestTemplates: {
          'application/json': `{
        "input": "$util.escapeJavaScript($input.body)",
        "stateMachineArn": "${usersStateMachine.stateMachineArn}"
      }`,
        },
      },
    });

    // Crear un recurso de API y método para invocar la Step Function
    const stepFunctionResource = api.root.addResource('payment');

    stepFunctionResource.addMethod('POST', stepFunctionIntegration, {
      methodResponses: [{ statusCode: '200' }],
    });
  }
}
