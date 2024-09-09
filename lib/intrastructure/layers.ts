import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';

export const getPowertoolsLayer = (scope: Construct) =>
  lambda.LayerVersion.fromLayerVersionArn(
    scope,
    'powertools-layer',
    `arn:aws:lambda:${cdk.Stack.of(scope).region}:094274105915:layer:AWSLambdaPowertoolsTypeScriptV2:12`,
  );
