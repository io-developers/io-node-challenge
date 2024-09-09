/* eslint-disable camelcase */
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
    version: apiGateway.IResource,
  ) {
    super(scope, id);

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
                #set($output = $inputRoot.output)
                #set($response = $util.parseJson($output))

                #if($inputRoot.status == "SUCCEEDED")
                  #if($response && $response.transac_ok == "Y")
                    {
                      "message": "$response.message",
                      "transactionId": "$response.transactionId"
                    }
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

    const payments = version.addResource('payments');

    payments.addMethod('POST', stepFunctionIntegration, {
      methodResponses: [{ statusCode: '200' }],
    });
  }
}
