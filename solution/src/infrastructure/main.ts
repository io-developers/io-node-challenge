import { Construct } from "constructs";
import { App, AssetType, TerraformAsset, TerraformStack } from "cdktf";
// import { DataAwsCallerIdentity } from "@cdktf/provider-aws/lib/data-aws-caller-identity";
import { AwsProvider } from "@cdktf/provider-aws/lib/provider";
import { dynamodbTable, lambdaFunction, lambdaEventSourceMapping, iamRole, iamPolicyAttachment, iamPolicy, s3Bucket, s3Object, lambdaLayerVersion, sfnStateMachine, iamRolePolicy, apiGatewayRestApi, apiGatewayResource, apiGatewayMethod, apiGatewayIntegration, apiGatewayIntegrationResponse, apiGatewayMethodResponse } from "@cdktf/provider-aws";
import { ACCOUNTS_TABLE_NAME, TRANSACTIONS_TABLE_NAME } from "../layer/nodejs/constants/constants";
import path = require("path");

const AWS_REGION = "us-east-1";

class MyStack extends TerraformStack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    new AwsProvider(this, "AWS", {
      region: AWS_REGION
    })

    // Setup IAM Roles
    const lambdaRole = new iamRole.IamRole(this, 'LambdaRole', {
      assumeRolePolicy: JSON.stringify({
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'sts:AssumeRole',
            Effect: 'Allow',
            Sid: '',
            Principal: {
              Service: 'lambda.amazonaws.com',
            },
          },
        ],
      }),
    });

    const lambdaLogPolicy = new iamPolicy.IamPolicy(this, 'LambdaLogPolicy', {
      name: 'LambdaLogPolicy',
      description: 'Allow Lambda functions to write logs to CloudWatch',
      policy: JSON.stringify({
        Version: '2012-10-17',
        Statement: [
          {
            Effect: 'Allow',
            Action: [
              'logs:CreateLogGroup',
              'logs:CreateLogStream',
              'logs:PutLogEvents',
            ],
            Resource: '*',
          },
        ],
      }),
    });
    
    new iamPolicyAttachment.IamPolicyAttachment(this, 'LambdaDynamodbPolicyAttachment', {
      name: "lambda-dynamodb-policy-attachment",
      roles: [lambdaRole.name],
      policyArn: 'arn:aws:iam::aws:policy/AmazonDynamoDBFullAccess', // For now give full access to dynamodb
    });

    new iamPolicyAttachment.IamPolicyAttachment(this, 'LambdaLogPolicyAttachment', {
      name: 'lambda-cloudwatch-policy-attachment',
      roles: [lambdaRole.name],
      policyArn: lambdaLogPolicy.arn,
    });

    // Post Payment Step Function Role
    const postPaymentStepFunctionRole = new iamRole.IamRole(this, "PostPaymentStepFunctionRole", {
      name: "StepFunctionRole",
      assumeRolePolicy: JSON.stringify({
        Version: "2012-10-17",
        Statement: [
          {
            Action: "sts:AssumeRole",
            Principal: {
              Service: "states.amazonaws.com",
            },
            Effect: "Allow",
          },
        ],
      }),
    });

    new iamPolicyAttachment.IamPolicyAttachment(this, "StepFunctionDynamoDBPolicy", {
      name: "payment-step-func-dynamodb-policy-attachment",
      policyArn: "arn:aws:iam::aws:policy/AmazonDynamoDBFullAccess", // For now give full access to dynamodb
      roles: [postPaymentStepFunctionRole.name]
    });

    new iamPolicyAttachment.IamPolicyAttachment(this, "StepFunctionLambdaPolicy", {
      name: "payment-step-func-lambda-policy-attachment",
      policyArn: "arn:aws:iam::aws:policy/AWSLambda_FullAccess", // For now give full access to lambda
      roles: [postPaymentStepFunctionRole.name]
    });
    
    // Setup DynamoDB Tables
    new dynamodbTable.DynamodbTable(this, "AccountsTable", {
      name: ACCOUNTS_TABLE_NAME,
      billingMode: "PAY_PER_REQUEST",
      hashKey: "accountId",
      attribute: [
        { name: "accountId", type: "S" },
      ],
    })

    const transactionTable = new dynamodbTable.DynamodbTable(this, "TransactionTable", {
      name: TRANSACTIONS_TABLE_NAME,
      billingMode: "PAY_PER_REQUEST",
      hashKey: "source",
      rangeKey: "id",
      attribute: [
        { name: "source", type: "S" },
        { name: "id", type: "N" },
      ],
      streamEnabled: true,
      streamViewType: "NEW_IMAGE",
    })

    // Setup s3 bucket for lambda functions
    const bucket = new s3Bucket.S3Bucket(this, 'LambdaBucket', {
      bucketPrefix: "lambdas-bucket"
    });

    // Setup Lambda Layer

    const layerAsset = new TerraformAsset(this, "LayerAsset", {
      path: path.resolve(__dirname, "../../dist/layer"),
      type: AssetType.ARCHIVE,
    });

    const layerArchive = new s3Object.S3Object(this, "layerArchive", {
      bucket: bucket.bucket,
      key: `layer/${layerAsset.fileName}`,
      source: layerAsset.path
    })

    const layer = new lambdaLayerVersion.LambdaLayerVersion(this, "Layer", {
      layerName: "layer",
      compatibleRuntimes: ["nodejs20.x"],
      s3Bucket: bucket.bucket,
      s3Key: layerArchive.key,
    });

    // Setup get-account lambda

    const getAccountLambdaAsset = new TerraformAsset(this, "GetAccountLambdaAsset", {
      path: path.resolve(__dirname, "../../dist/lambdas/get-account"),
      type: AssetType.ARCHIVE,
    });

    const getAccountLambdaArchive = new s3Object.S3Object(this, "GetAccountLambdaArchive", {
      bucket: bucket.bucket,
      key: `lambda/get-account/${getAccountLambdaAsset.fileName}`,
      source: getAccountLambdaAsset.path
    })

    const getAccountLambda = new lambdaFunction.LambdaFunction(this, 'GetAccountLambda', {
      functionName: 'get-account',
      runtime: 'nodejs20.x',
      handler: 'index.handler',
      s3Bucket: bucket.bucket,
      s3Key: getAccountLambdaArchive.key,
      memorySize: 128,
      role: lambdaRole.arn,
      layers: [layer.arn]
    });

    // Setup execute-payments lambda

    const executePaymentLambdaAsset = new TerraformAsset(this, "ExecutePaymentLambdaAsset", {
      path: path.resolve(__dirname, "../../dist/lambdas/execute-payment"),
      type: AssetType.ARCHIVE,
    });

    const executePaymentLambdaArchive = new s3Object.S3Object(this, "ExecutePaymentLambdaArchive", {
      bucket: bucket.bucket,
      key: `lambda/execute-payment/${executePaymentLambdaAsset.fileName}`,
      source: executePaymentLambdaAsset.path
    })

    const executePaymentLambda = new lambdaFunction.LambdaFunction(this, 'ExecutePaymentLambda', {
      functionName: 'execute-payment',
      runtime: 'nodejs20.x',
      handler: 'index.handler',
      s3Bucket: bucket.bucket,
      s3Key: executePaymentLambdaArchive.key,
      memorySize: 128,
      role: lambdaRole.arn,
      layers: [layer.arn]
  });

    // Setup update-account lambda

    const updateAccountLambdaAsset = new TerraformAsset(this, "UpdateAccountLambdaAsset", {
      path: path.resolve(__dirname, "../../dist/lambdas/update-account"),
      type: AssetType.ARCHIVE,
    });

    const updateAccountLambdaArchive = new s3Object.S3Object(this, "UpdateAccountLambdaArchive", {
      bucket: bucket.bucket,
      key: `lambda/update-account/${updateAccountLambdaAsset.fileName}`,
      source: updateAccountLambdaAsset.path
    })

    const updateAccountLambda = new lambdaFunction.LambdaFunction(this, "UpdateAccountLambda", {
      functionName: "update-account",
      runtime: "nodejs20.x",
      handler: "index.handler",
      s3Bucket: bucket.bucket,
      s3Key: updateAccountLambdaArchive.key,
      memorySize: 128,
      role: lambdaRole.arn,
      layers: [layer.arn]
    })

    new lambdaEventSourceMapping.LambdaEventSourceMapping(this, "UpdateAccountDynamoDBStreamTrigger", {
      eventSourceArn: transactionTable.streamArn,
      functionName: updateAccountLambda.functionName,
      startingPosition: "LATEST"
    }).node.addDependency(updateAccountLambda)

    // Setup Post Payment Step Function
    const paymentStatesDefinition = {
      StartAt: "GetAccount",
      States: {
        GetAccount: {
          Type: "Task",
          Resource: "arn:aws:states:::dynamodb:getItem",
          Parameters: {
            TableName: ACCOUNTS_TABLE_NAME,
            Key: {
              "accountId": {
                "S.$": "$.accountId",
              },
            },
          },
          ResultPath: "$.account",
          Next: "ValidateAccount",
        },
        ValidateAccount: {
          Type: "Choice",
          Choices: [
            {
              Variable: "$.account.Item",
              IsPresent: false,
              Next: "FailState",
            }
          ],
          Default: "ExecutePayment",
        },
        ExecutePayment: {
          Type: "Task",
          Resource: executePaymentLambda.arn,
          InputPath: "$",
          ResultPath: "$.paymentResult",
          Parameters: {
            "accountId.$": "$.account.Item.accountId.S",
            "amount.$": "$.amount",
          },
          Catch: [
            {
              ErrorEquals: ["States.ALL"],
              Next: "FailState",
            },
          ],
          Next: "SaveTransaction",
        },
        SaveTransaction: {
          Type: "Task",
          Resource: "arn:aws:states:::dynamodb:putItem",
          Parameters: {
            TableName: TRANSACTIONS_TABLE_NAME,
            Item: {
              "source": {
                "S.$": "$.paymentResult.transactionId",
              },
              "id": {
                "N.$": "States.Format('{}', $.paymentResult.id)",
              },
              "data": {
                "M": {
                  "accountId": {
                    "S.$": "$.accountId",
                  },
                  "amount": {
                    "N.$": "States.Format('{}', $.amount)",
                  }
                }
              }
            },
          },
          ResultPath: "$.saveResult",
          Next: "SuccessState",
        },
        SuccessState: {
          Type: "Succeed",
          InputPath: "$",
          OutputPath: "$",
        },
        FailState: {
          Type: "Fail",
          Cause: "Something was wrong",
          Error: "PaymentFailed"
        },
      }
    }

    const postPaymentStepFunction = new sfnStateMachine.SfnStateMachine(this, "PostPaymentStepFunction", {
      name: "PostPaymentStepFunction",
      roleArn: postPaymentStepFunctionRole.arn,
      definition: JSON.stringify(paymentStatesDefinition)
    })

    // Setup /v1 Api Gateway

    const api = new apiGatewayRestApi.ApiGatewayRestApi(this, "Api", {
      name: "Api",
    });

    const v1Resource = new apiGatewayResource.ApiGatewayResource(this, "V1Resource", {
      restApiId: api.id,
      parentId: api.rootResourceId,
      pathPart: "v1",
    });

    const accountsResource = new apiGatewayResource.ApiGatewayResource(this, "AccountsResource", {
      restApiId: api.id,
      parentId: v1Resource.id,
      pathPart: "accounts",
    });

    const accountIdResource = new apiGatewayResource.ApiGatewayResource(this, "AccountIdResource", {
      restApiId: api.id,
      parentId: accountsResource.id,
      pathPart: "{accountId}",
    });

    const paymentResource = new apiGatewayResource.ApiGatewayResource(this, "PaymentResource", {
      restApiId: api.id,
      parentId: v1Resource.id,
      pathPart: "payments",
    });

    const postPaymentMethod = new apiGatewayMethod.ApiGatewayMethod(this, "PostPaymentMethod", {
      restApiId: api.id,
      resourceId: paymentResource.id,
      httpMethod: "POST",
      authorization: "NONE",
    });

    const getAccountMethod = new apiGatewayMethod.ApiGatewayMethod(this, "GetAccountMethod", {
      restApiId: api.id,
      resourceId: accountIdResource.id,
      httpMethod: "GET",
      authorization: "NONE",
    });

    // Role For Account Api
    const accountApiRole = new iamRole.IamRole(this, "AccountApiRole", {
      name: "AccountApiRole",
      assumeRolePolicy: JSON.stringify({
        Version: "2012-10-17",
        Statement: [
          {
            Effect: "Allow",
            Principal: {
              Service: "apigateway.amazonaws.com",
            },
            Action: "sts:AssumeRole",
          },
        ],
      }),
    });

    new iamRolePolicy.IamRolePolicy(this, "AccountApiPolicy", {
      role: accountApiRole.name,
      policy: JSON.stringify({
        Version: "2012-10-17",
        Statement: [
          {
            Effect: "Allow",
            Action: ["lambda:InvokeFunction"],
            Resource: getAccountLambda.arn,
          },
        ],
      }),
    });


    const getAccountIntegration = new apiGatewayIntegration.ApiGatewayIntegration(this, "GetAccountIntegration", {
      restApiId: api.id,
      resourceId: accountIdResource.id,
      httpMethod: getAccountMethod.httpMethod,
      integrationHttpMethod: "POST",
      credentials: accountApiRole.arn,
      type: "AWS_PROXY",
      uri: `arn:aws:apigateway:${AWS_REGION}:lambda:path/2015-03-31/functions/${getAccountLambda.arn}/invocations`,
    });
    
    getAccountIntegration.node.addDependency(getAccountLambda);

    // Role For Payment Api
    const paymentApiRole = new iamRole.IamRole(this, "PaymentApiRole", {
      name: "PaymentApiRole",
      assumeRolePolicy: JSON.stringify({
        Version: "2012-10-17",
        Statement: [
          {
            Effect: "Allow",
            Principal: {
              Service: "apigateway.amazonaws.com",
            },
            Action: "sts:AssumeRole",
          },
        ],
      }),
    });

    new iamRolePolicy.IamRolePolicy(this, "PaymentApiStfPolicy", {
      role: paymentApiRole.name,
      policy: JSON.stringify({
        Version: "2012-10-17",
        Statement: [
          {
            Effect: "Allow",
            Action: ["states:StartExecution"],
            Resource: postPaymentStepFunction.arn,
          },
        ],
      }),
    });

    const paymentApiGatewayIntegration = new apiGatewayIntegration.ApiGatewayIntegration(this, "PaymentApiStepFunctionIntegration", {
      restApiId: api.id,
      resourceId: paymentResource.id,
      type: "AWS",
      httpMethod: postPaymentMethod.httpMethod,
      integrationHttpMethod: "POST",
      uri: `arn:aws:apigateway:${AWS_REGION}:states:action/StartExecution`,
      credentials: paymentApiRole.arn,
      requestTemplates: {
        "application/json": `{
          "input": "$util.escapeJavaScript($input.body)",
          "stateMachineArn": "${postPaymentStepFunction.arn}"
        }`,
      },
    });

    new apiGatewayIntegrationResponse.ApiGatewayIntegrationResponse(this, 'PaymentApiIntegrationResponse', {
      restApiId: api.id,
      resourceId: paymentResource.id,
      httpMethod: paymentApiGatewayIntegration.httpMethod,
      statusCode: '400',
      responseTemplates: {
        'application/json': `{
          "message": "Something was wrong"
        }`,
      },
      selectionPattern: ".*PaymentFailed.*"
    }).node.addDependency(paymentApiGatewayIntegration);

    new apiGatewayIntegrationResponse.ApiGatewayIntegrationResponse(this, 'SuccessPaymentApiIntegrationResponse', {
      restApiId: api.id,
      resourceId: paymentResource.id,
      httpMethod: paymentApiGatewayIntegration.httpMethod,
      statusCode: '200',
      responseTemplates: {
        'application/json': `{
          "message": "Payment registered successfully",
          "transactionId": "$input.path('$.paymentResult.transactionId')"
        }`,
      },
    }).node.addDependency(paymentApiGatewayIntegration);

    new apiGatewayMethodResponse.ApiGatewayMethodResponse(this, 'PaymentApiMethodResponse', {
      restApiId: api.id,
      resourceId: paymentResource.id,
      httpMethod: postPaymentMethod.httpMethod,
      statusCode: '400',
      responseModels: {
        'application/json': 'Empty',
      },
    });

    new apiGatewayMethodResponse.ApiGatewayMethodResponse(this, 'PaymentApiMethodResponse200', {
      restApiId: api.id,
      resourceId: paymentResource.id,
      httpMethod: postPaymentMethod.httpMethod,
      statusCode: '200',
      responseModels: {
        'application/json': 'Empty',
      },
    });

    // const apiDeployment = new apiGatewayDeployment.ApiGatewayDeployment(this, "ApiDeployment", {
    //   restApiId: api.id,
    //   stageName: "dev",
    // });

    // apiDeployment.node.addDependency(api)
    // apiDeployment.node.addDependency(getAccountMethod)
    // apiDeployment.node.addDependency(postPaymentMethod)
    

  }
}

const app = new App();
new MyStack(app, "solution");
app.synth();
