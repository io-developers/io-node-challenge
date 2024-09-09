# ...

resource "aws_sfn_state_machine" "sfn_state_machine" {
  name     = "my-state-machine"
  role_arn = aws_iam_role.iam_for_sfn.arn

  definition = jsonencode({
    StartAt = "GetAccount"
    States = {
      GetAccount = {
        Type     = "Task"
        Resource = "arn:aws:states:::dynamodb:getItem"
        Parameters = {
          TableName = "accounts"
          Key = {
            "id" = { "S.$" = "$.accountId" }
          }
        }
        ResultPath = "$.resultGetAccount"
        Next       = "ValidateAccount"
      }
      ValidateAccount = {
        Type = "Choice"
        Choices = [
          {
            Variable  = "$.resultGetAccount.Item"
            IsPresent = true
            Next      = "execute-payments"
          }
        ]
        Default = "Fail"
      }
      execute-payments = {
        Type     = "Task"
        Resource = aws_lambda_function.execute-payments.arn
        Parameters = {
          "accountId.$" = "$.resultGetAccount.Item.id.S"
          "amount.$"    = "$.amount"
        }
        ResultPath = "$.paymentResult"
        Next       = "SaveTransaction"
      }
      SaveTransaction = {
        Type     = "Task"
        Resource = "arn:aws:states:::dynamodb:putItem"
        Parameters = {
          TableName = "transactions"
          Item = {
            "source" = { "S.$" = "$.paymentResult.source" }
            "id"     = { "S.$" = "$.paymentResult.id" }
            "data" = {
              "M" = {
                "accountId" = { "S.$" = "$.resultGetAccount.Item.id.S" }
                "amount"    = { "N.$" = "States.JsonToString($.paymentResult.amount)" }
              }
            }
          }
        }
        ResultPath = "$.putTransactionResult"
        Next       = "Success"
      }
      Success = {
        Type = "Succeed"
      }
      Fail = {
        Type = "Fail"
      }
    }
  })
}

resource "aws_iam_role" "iam_for_sfn" {
  name               = "iam_for_sfn"
  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "states.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
EOF
}

resource "aws_iam_policy" "sfn_policy_lambda" {
  name   = "sfn_policy_lambda"
  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "lambda:InvokeFunction",
        "lambda:ListFunctions"
      ],
      "Resource": "*"
    }
  ]
}
EOF
}
resource "aws_iam_policy" "sfn_policy_dynamodb" {
  name   = "sfn_policy_dynamodb"
  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "dynamodb:GetItem",
        "dynamodb:PutItem"
      ],
      "Resource": "*"
    }
  ]
}
EOF
}

resource "aws_iam_role_policy_attachment" "sfn_policy_lambda_attachment" {
  role       = aws_iam_role.iam_for_sfn.name
  policy_arn = aws_iam_policy.sfn_policy_lambda.arn
}
resource "aws_iam_role_policy_attachment" "sfn_policy_dynamodb_attachment" {
  role       = aws_iam_role.iam_for_sfn.name
  policy_arn = aws_iam_policy.sfn_policy_dynamodb.arn
}