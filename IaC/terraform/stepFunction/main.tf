resource "aws_sfn_state_machine" "st" {
  name       = var.step-function-name
  type       = "EXPRESS"
  role_arn   = aws_iam_role.step_function_role.arn
  definition = <<EOF
{
  "Comment": "State Machine to process transaction",
  "StartAt": "Validate User",
  "States": {
    "Validate User": {
      "Type": "Task",
      "Resource": "arn:aws:states:::dynamodb:getItem",
      "InputPath": "$",
      "Parameters": {
        "TableName": "${var.table-name-users}",
        "Key": {
          "userId": {
            "S.$": "$.userId"
          }
        }
      },
      "Next": "hasUser",
      "ResultPath": "$.outputGetUser"
    },
    "hasUser": {
      "Type": "Choice",
      "Choices": [
        {
          "Variable": "$.outputGetUser.Item",
          "IsPresent": true,
          "Next": "Execute Payments"
        }
      ],
      "Default": "Fail"
    },
    "Execute Payments": {
      "Type": "Task",
      "Resource": "arn:aws:states:::lambda:invoke",
      "ResultPath": "$.payments",
      "ResultSelector": {
        "body.$": "States.StringToJson($.Payload.body)"
      },
      "InputPath": "$",
      "Parameters": {
        "FunctionName": "${var.lambda-payments-arn}",
        "Payload": {
          "userId.$": "$.userId",
          "amount.$": "$.amount"
        }
      },
      "Retry": [
        {
          "ErrorEquals": [
            "States.ALL"
          ],
          "IntervalSeconds": 4,
          "MaxAttempts": 3,
          "BackoffRate": 1
        }
      ],
      "Catch": [
        {
          "ErrorEquals": [
            "States.ALL"
          ],
          "ResultPath": "$.errorInfo",
          "Next": "Fail"
        }
      ],
      "Next": "Is Success"
    },
    "Is Success": {
      "Type": "Choice",
      "Choices": [
        {
          "Variable": "$.payments.body.success",
          "BooleanEquals": true,
          "Comment": "Process correct",
          "Next": "write transactions"
        }
      ],
      "Default": "Fail"
    },
    "write transactions": {
      "Type": "Task",
      "Resource": "arn:aws:states:::dynamodb:putItem",
      "ResultPath": null,
      "OutputPath": "$.payments.body.result",
      "Parameters": {
        "TableName": "${var.table-name-transactions}",
        "Item": {
          "transactionId": {
            "S.$": "$.payments.body.result.transactionId"
          },
          "transactionDescription": {
            "S.$": "$.payments.body.result.transactionDescription"
          },
          "amount": {
            "N.$": "States.Format('{}',$.payments.body.result.amount)"
          },
          "userId": {
            "S.$": "$.payments.body.result.userId"
          }
        }
      },
      "Next": "Success"
    },
    "Success": {
      "Type": "Succeed"
    },
    "Fail": {
      "Type": "Fail"
    }
  }
}
EOF
  logging_configuration {
    level                  = "ALL"
    include_execution_data = true
    log_destination        = "${aws_cloudwatch_log_group.log_group_for_sfn.arn}:*"
  }
}
