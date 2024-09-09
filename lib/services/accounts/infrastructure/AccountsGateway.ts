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
    customDomain: apiGateway.DomainName,
  ) {
    super(scope, id);

    const api = new apiGateway.RestApi(this, 'AccountsApi', {
      restApiName: 'Accounts API',
      description: 'Backend - Accounts API',
    });

    new apiGateway.BasePathMapping(this, 'PaymentApi-mapping', {
      domainName: customDomain,
      restApi: api,
      basePath: 'accounts', // Path base para esta API
    });

    // Crear un recurso de API y método para invocar la Step Function
    const accounts = api.root.addResource('accounts');
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
