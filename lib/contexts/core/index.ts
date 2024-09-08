import * as acm from 'aws-cdk-lib/aws-certificatemanager';
import * as route53 from 'aws-cdk-lib/aws-route53';
import { Construct } from 'constructs';

export class DomainName extends Construct {
  hostedZone: route53.HostedZone;

  domainName: string;

  apicertificate: acm.Certificate;

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

    this.hostedZone = hostedZone;
    this.apicertificate = apiCertificate;
    this.domainName = domainName;
  }
}
