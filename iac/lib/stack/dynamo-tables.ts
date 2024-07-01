import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import { Construct } from 'constructs';

export class DynamoTables {
  public readonly activityTable: dynamodb.Table;
  public readonly transactionsTable: dynamodb.Table;
  public readonly usersTable: dynamodb.Table;

  constructor(scope: Construct) {
    this.activityTable = new dynamodb.Table(scope, 'ActivityTable', {
      partitionKey: { name: 'activityId', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
    });

    this.transactionsTable = new dynamodb.Table(scope, 'TransactionsTable', {
      partitionKey: { name: 'transactionId', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      stream: dynamodb.StreamViewType.NEW_AND_OLD_IMAGES,
    });

    this.usersTable = new dynamodb.Table(scope, 'UsersTable', {
      partitionKey: { name: 'userId', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
    });
  }
}
