import * as apiGateway from 'aws-cdk-lib/aws-apigateway';
import * as acm from 'aws-cdk-lib/aws-certificatemanager';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as route53 from 'aws-cdk-lib/aws-route53';
import * as route53Targets from 'aws-cdk-lib/aws-route53-targets';
import * as sfn from 'aws-cdk-lib/aws-stepfunctions';
import { Construct } from 'constructs';

export class PaymentGateway extends Construct {
  constructor(
    scope: Construct,
    id: string,
    usersStateMachine: sfn.StateMachine,
    hostedZone: route53.HostedZone,
    apicertificate: acm.Certificate,
    domainName: string,
  ) {
    super(scope, id);

    const api = new apiGateway.RestApi(this, 'PaymentApi', {
      restApiName: 'Payment API',
      description: 'Backend - Payment API',
    });

    // Custom Domain
    api.addDomainName(domainName, {
      domainName,
      securityPolicy: apiGateway.SecurityPolicy.TLS_1_2,
      certificate: apicertificate,
    });

    // Route53 DNS
    // eslint-disable-next-line no-new
    new route53.ARecord(this, 'domain_alias_record', {
      recordName: domainName,
      zone: hostedZone,
      target: route53.RecordTarget.fromAlias(new route53Targets.ApiGateway(api)),
    });

    // Permisos para que API Gateway pueda invocar la Step Function
    const role = new iam.Role(this, 'ApiGatewayStepFunctionsRole', {
      assumedBy: new iam.ServicePrincipal('apigateway.amazonaws.com'),
    });

    role.addToPolicy(
      new iam.PolicyStatement({
        actions: ['states:StartExecution'],
        resources: [usersStateMachine.stateMachineArn],
      }),
    );

    const stepFunctionIntegration = new apiGateway.AwsIntegration({
      service: 'states',
      action: 'StartExecution',
      options: {
        credentialsRole: role,
        integrationResponses: [
          {
            statusCode: '200',
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
