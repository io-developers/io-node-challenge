/* eslint-disable camelcase */
/* eslint-disable no-new */
import * as apiGateway from 'aws-cdk-lib/aws-apigateway';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';

export class AccountsGateway extends Construct {
  constructor(
    scope: Construct,
    id: string,
    getAccountLambda: NodejsFunction,
    getAccountsLambda: NodejsFunction,
    version: apiGateway.IResource,
  ) {
    super(scope, id);

    const accounts = version.addResource('accounts');
    const account = accounts.addResource('{accountId}');

    accounts.addMethod(
      'GET',
      new apiGateway.LambdaIntegration(getAccountsLambda, {
        requestTemplates: { 'application/json': '{ "statusCode": "200" }' },
      }),
    );

    account.addMethod(
      'GET',
      new apiGateway.LambdaIntegration(getAccountLambda, {
        requestTemplates: { 'application/json': '{ "statusCode": "200" }' },
      }),
    );
  }
}
