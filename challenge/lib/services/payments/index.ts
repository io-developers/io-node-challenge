import {
  PassthroughBehavior,
  RestApi,
  StepFunctionsIntegration,
} from "aws-cdk-lib/aws-apigateway";
import { Table } from "aws-cdk-lib/aws-dynamodb";
import {
  PolicyDocument,
  PolicyStatement,
  Role,
  ServicePrincipal,
} from "aws-cdk-lib/aws-iam";
import { Construct } from "constructs";

import { PaymentsServiceFunctions } from "./constructs/functions";
import { PaymentStateMachine } from "./constructs/state-machine";

interface PaymentsServiceProps {
  usersTable: Table;
  transactionsTable: Table;
  activityTable: Table;
  restApi: RestApi;
}

class PaymentsService extends Construct {
  constructor(scope: Construct, id: string, props: PaymentsServiceProps) {
    super(scope, id);

    const { executePayments: executePaymentsLambda } = new PaymentsServiceFunctions(
      this,
      "PaymentsServiceFunctions",
      {
        activityTable: props.activityTable,
        transactionsTable: props.transactionsTable,
      }
    );

    const { stateMachine } = new PaymentStateMachine(this, "PaymentsStateMachine", {
      ...props,
      executePaymentsLambda,
    });

    const invokeStepfunctionApiRole = new Role(this, `${id}-role`, {
      assumedBy: new ServicePrincipal("apigateway.amazonaws.com"),
      inlinePolicies: {
        allowInvokeStepFunctions: new PolicyDocument({
          statements: [
            new PolicyStatement({
              actions: ["states:StartSyncExecution"],
              resources: [stateMachine.stateMachineArn],
            }),
          ],
        }),
      },
    });

    const stateMachineIntegration = StepFunctionsIntegration.startExecution(
      stateMachine,
      {
        integrationResponses: [
          {
            selectionPattern: "200",
            statusCode: "201",
            responseTemplates: {
              "application/json": `
                #set($outputString = $input.path('$.output'))
                #set($outputJson = $util.parseJson($outputString))
                {
                    "message": "$util.escapeJavaScript($outputJson.value.message)",
                    #if($util.escapeJavaScript($outputJson.value.transactionId) != "")
                        "transactionId": "$util.escapeJavaScript($outputJson.value.transactionId)"
                    #end
                }
            `,
            },
            responseParameters: {
              "method.response.header.Access-Control-Allow-Methods":
                "'OPTIONS,GET,PUT,POST,DELETE,PATCH,HEAD'",
              "method.response.header.Access-Control-Allow-Headers":
                "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Amz-User-Agent'",
              "method.response.header.Access-Control-Allow-Origin": "'*'",
            },
          },
        ],
        requestTemplates: {
          "application/json": `{
            "input": "$util.escapeJavaScript($input.json('$'))",
            "stateMachineArn": "${stateMachine.stateMachineArn}"
          }`,
        },
        passthroughBehavior: PassthroughBehavior.NEVER,
        credentialsRole: invokeStepfunctionApiRole,
      }
    );

    props.restApi.root
      .addResource("payments")
      .addMethod("POST", stateMachineIntegration, {
        methodResponses: [
          {
            statusCode: "201",
            responseParameters: {
              "method.response.header.Access-Control-Allow-Methods": true,
              "method.response.header.Access-Control-Allow-Headers": true,
              "method.response.header.Access-Control-Allow-Origin": true,
            },
          },
        ],
      });
  }
}

export default PaymentsService;
