import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import { Construct } from 'constructs';

export class Tables extends Construct {
  accountsTable: dynamodb.Table;

  transactionsTable: dynamodb.Table;

  constructor(scope: Construct, id: string) {
    super(scope, id);

    const accountsTable = new dynamodb.Table(this, 'accounts', {
      partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
    });

    const transactionsTable = new dynamodb.Table(this, 'transactions', {
      partitionKey: { name: 'source', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'id', type: dynamodb.AttributeType.STRING },
      stream: dynamodb.StreamViewType.NEW_IMAGE,
    });

    this.accountsTable = accountsTable;
    this.transactionsTable = transactionsTable;
  }
}
