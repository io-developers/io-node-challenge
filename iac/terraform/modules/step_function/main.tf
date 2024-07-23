resource "aws_sfn_state_machine" "payments_step_function" {
  name       = "bcp_challenged_io_backend"
  type       = "EXPRESS"
  role_arn   = aws_iam_role.step_function_role.arn
  definition = <<EOF
 {
  "Comment": "Step Function - bcp challenged - iO - Backend",
  "StartAt": "ValidateUser",
  "States": {
    "ValidateUser": {
      "Type": "Task",
      "Resource": "arn:aws:states:::aws-sdk:dynamodb:getItem",
      "InputPath": "$",
      "Parameters": {
        "TableName": "${var.users_table}",
        "Key": {
          "userId": {
            "S.$": "$.userId"
          }
        }
      },
      "Next": "CheckUserExists",
      "ResultPath": "$.outputGetUser"
    },
    "CheckUserExists": {
      "Type": "Choice",
      "Choices": [
        {
          "Variable": "$.outputGetUser.Item",
          "IsPresent": true,
          "Next": "ExecutePayment"
        }
      ],
      "Default": "UserNotFound"
    },
    "ExecutePayment": {
      "Type": "Task",
      "Resource": "arn:aws:lambda:us-east-1:922367397130:function:lambda_execute_payments",
      "ResultPath": "$.paymentResult",
      "Next": "RecordTransaction",
      "Catch": [
        {
          "ErrorEquals": [
            "PaymentFailed"
          ],
          "ResultPath": "$.error",
          "Next": "PaymentFailed"
        }
      ]
    },
    "RecordTransaction": {
      "Type": "Task",
      "Resource": "arn:aws:states:::aws-sdk:dynamodb:putItem",
      "Parameters": {
        "TableName": "${var.transactions_table}",
        "Item": {
          "transactionId": {
            "S.$": "States.Format('{}', $.userId)"
          },
          "userId": {
            "S.$": "States.Format('{}', $.userId)"
          },
          "paymentAmount": {
            "N.$": "States.Format('{}', 100)"
          }
        }
      },
      "Next": "Success"
    },
    "UserNotFound": {
      "Type": "Fail",
      "Error": "UserNotFound",
      "Cause": "The specified user does not exist."
    },
    "PaymentFailed": {
      "Type": "Fail",
      "Error": "PaymentFailed",
      "Cause": "The payment process failed."
    },
    "Success": {
      "Type": "Succeed"
    }
  }
}
EOF
}

resource "aws_iam_role" "step_function_role" {
  name = "step_function_role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Action = "sts:AssumeRole",
        Effect = "Allow",
        Principal = {
          Service = "states.amazonaws.com"
        }
      }
    ]
  })
}

resource "aws_iam_policy" "step_function_policy" {
  name        = "step_function_policy"
  description = "Policy for Step Function to access DynamoDB and Lambda"
  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Action = [
          "dynamodb:*",
        ],
        Effect = "Allow",
        Resource = [
          var.table_users_arn,
          var.table_transactions_arn
        ]
      },
      {
        Action   = "lambda:*",
        Effect   = "Allow",
        Resource = var.lambda_execute_payment_invoke_arn
      },
      {
        Action   = "lambda:*",
        Effect   = "Allow",
        Resource = "arn:aws:lambda:us-east-1:922367397130:function:lambda_execute_payments",
      },
      {
        Effect = "Allow",
        Action = [
          "states:StartSyncExecution",
          "states:DescribeExecution",
          "states:GetExecutionHistory"
        ],
        Resource = "*"
      },
    ]
  })
}

resource "aws_iam_role_policy_attachment" "step_functions_policy_attachment" {
  role       = aws_iam_role.step_function_role.name
  policy_arn = aws_iam_policy.step_function_policy.arn
}

resource "aws_iam_role_policy_attachment" "CloudWatchLogsFullAccess" {
  role       = aws_iam_role.step_function_role.name
  policy_arn = "arn:aws:iam::aws:policy/CloudWatchLogsFullAccess"
}

