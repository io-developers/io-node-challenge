/* eslint-disable no-new */
import * as apiGateway from 'aws-cdk-lib/aws-apigateway';
import * as acm from 'aws-cdk-lib/aws-certificatemanager';
import * as route53 from 'aws-cdk-lib/aws-route53';
import * as route53Targets from 'aws-cdk-lib/aws-route53-targets';
import { Construct } from 'constructs';

export class DomainName extends Construct {
  version: apiGateway.IResource;

  constructor(scope: Construct, id: string, hostedZoneName: string) {
    super(scope, id);

    const domainName = `api.${hostedZoneName}`;

    const hostedZone = new route53.HostedZone(this, 'HostedZone', {
      zoneName: hostedZoneName,
    });

    // eslint-disable-next-line no-new
    const apiCertificate = new acm.Certificate(this, 'ApiCertificate', {
      domainName,
      certificateName: `ApiCertificate-${domainName}`,
      validation: acm.CertificateValidation.fromDns(hostedZone),
    });

    const customDomain = new apiGateway.DomainName(this, 'CustomDomain', {
      domainName,
      certificate: apiCertificate,
      endpointType: apiGateway.EndpointType.REGIONAL,
    });

    new route53.ARecord(this, 'ApiDomainAliasRecord', {
      zone: hostedZone,
      recordName: 'api',
      target: route53.RecordTarget.fromAlias(new route53Targets.ApiGatewayDomain(customDomain)),
    });

    const api = new apiGateway.RestApi(this, 'BankApi', {
      restApiName: 'Bank API',
      description: 'Backend - Bank API',
    });

    new apiGateway.BasePathMapping(this, 'BankAPIMapping', {
      domainName: customDomain,
      restApi: api,
      // basePath: '',
    });

    const version = api.root.addResource('v1');

    this.version = version;
  }
}
