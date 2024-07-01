resource "aws_iam_role" "step_functions_role" {
  name = "step_functions_role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "states.amazonaws.com"
        }
      },
    ]
  })
}

resource "aws_iam_role_policy" "step_functions_policy" {
  name = "step_functions_policy"
  role = aws_iam_role.step_functions_role.id
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = [
          "lambda:InvokeFunction",
          "dynamodb:GetItem",
          "dynamodb:PutItem"
        ]
        Effect   = "Allow"
        Resource = "*"
      }
    ]
  })
}

resource "aws_sfn_state_machine" "state_machine" {
  name     = "user-state-machine"
  role_arn = aws_iam_role.step_functions_role.arn
  definition = <<DEFINITION
{
  "Comment": "A simple AWS Step Functions state machine to validate user and call lambda.",
  "StartAt": "ValidateUser",
  "States": {
    "ValidateUser": {
      "Type": "Task",
      "Resource": "arn:aws:states:::dynamodb:getItem",
      "Parameters": {
        "TableName": "users",
        "Key": {
          "userId": {
            "S.$": "$.userId"
          }
        }
      },
      "ResultPath": "$.dbResult",
      "Next": "CheckUserExists"
    },
    "CheckUserExists": {
      "Type": "Choice",
      "Choices": [
        {
          "Variable": "$.dbResult.Item",
          "IsPresent": true,
          "Next": "ExecutePayments"
        }
      ],
      "Default": "Fail"
    },
    "ExecutePayments": {
      "Type": "Task",
      "Resource": "arn:aws:lambda:us-east-2:381492019810:function:lambda-execute-payments",
       "Next": "CheckPaymentResult"
    },
    "CheckPaymentResult": {
      "Type": "Choice",
      "Choices": [
        {
          "Variable": "$.statusCode",
          "NumericEquals": 200,
          "Next": "ParseBody"
        }
      ],
      "Default": "Fail"
    },
    "ParseBody": {
      "Type": "Task",
      "Resource": "arn:aws:lambda:us-east-2:381492019810:function:parsearJson",
      "Next": "RecordTransaction"
    },
    "RecordTransaction": {
      "Type": "Task",
      "Resource": "arn:aws:states:::dynamodb:putItem",
      "Parameters": {
        "TableName": "transactions",
        "Item": {
          "transactionId": {
            "S.$": "$.transactionId"
          },
          "userId": {
            "S.$": "$.userId"
          },
          "paymentAmount": {
            "S.$": "$.amount"
          }
        }
      },
      "Next": "SucceedStage"
    },
    "SucceedStage": {
      "Type": "Pass",
      "Result": {
        "message": "Payment registered successfully",
        "transactionId.$": "$.transactionId"
      },
      "End": true
    },
    "Fail": {
      "Type": "Fail",
      "Error": "UserNotFound",
      "Cause": "{\"message\": \"Something was wrong\"}"
    }
  }
}
DEFINITION
}