provider "aws" {
  access_key                  = "test"
  secret_key                  = "test"
  region                      = "us-east-1"
  s3_use_path_style           = false
  skip_credentials_validation = true
  skip_metadata_api_check     = true
  skip_requesting_account_id  = true

  endpoints {
    apigateway     = "http://localhost:4566"
    apigatewayv2   = "http://localhost:4566"
    cloudformation = "http://localhost:4566"
    cloudwatch     = "http://localhost:4566"
    dynamodb       = "http://localhost:4566"
    ec2            = "http://localhost:4566"
    es             = "http://localhost:4566"
    elasticache    = "http://localhost:4566"
    firehose       = "http://localhost:4566"
    iam            = "http://localhost:4566"
    kinesis        = "http://localhost:4566"
    lambda         = "http://localhost:4566"
    rds            = "http://localhost:4566"
    redshift       = "http://localhost:4566"
    route53        = "http://localhost:4566"
    s3             = "http://s3.localhost.localstack.cloud:4566"
    secretsmanager = "http://localhost:4566"
    ses            = "http://localhost:4566"
    sns            = "http://localhost:4566"
    sqs            = "http://localhost:4566"
    ssm            = "http://localhost:4566"
    stepfunctions  = "http://localhost:4566"
    sts            = "http://localhost:4566"
  }
}

resource "aws_dynamodb_table" "transactions" {
  name         = "transactions"
  billing_mode = "PAY_PER_REQUEST" # Use on-demand billing mode
  hash_key     = "transactionId"   # Partition key

  attribute {
    name = "transactionId"
    type = "S" # String type for UUID
  }

  attribute {
    name = "userId"
    type = "S" # String type for UUID
  }

  attribute {
    name = "amount"
    type = "N" # Number type for amount
  }

  global_secondary_index {
    name            = "UserIdIndex"
    hash_key        = "userId"
    projection_type = "ALL" # Index all attributes in the projection
    read_capacity   = 5
    write_capacity  = 5
  }

  global_secondary_index {
    name            = "AmountIndex"
    hash_key        = "amount"
    projection_type = "ALL" # Index all attributes in the projection
    read_capacity   = 5
    write_capacity  = 5
  }

  stream_enabled   = true
  stream_view_type = "NEW_IMAGE"

  tags = {
    Name = "transactions"
  }
}

resource "aws_dynamodb_table" "users" {
  name         = "users"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "userId"

  attribute {
    name = "userId"
    type = "S"
  }

  attribute {
    name = "name"
    type = "S"
  }

  attribute {
    name = "lastName"
    type = "S"
  }

  global_secondary_index {
    name            = "NameIndex"
    hash_key        = "name"
    projection_type = "ALL" # Index all attributes in the projection
    read_capacity   = 5
    write_capacity  = 5
  }

  global_secondary_index {
    name            = "LastNameIndex"
    hash_key        = "lastName"
    projection_type = "ALL" # Index all attributes in the projection
    read_capacity   = 5
    write_capacity  = 5
  }


  tags = {
    Name = "users"
  }
}

resource "aws_dynamodb_table_item" "user_pedro" {
  table_name = aws_dynamodb_table.users.name
  hash_key   = "userId"

  item = <<ITEM
{
  "userId": {"S": "f529177d-0521-414e-acd9-6ac840549e97"},
  "name": {"S": "Pedro"},
  "lastName": {"S": "Suarez"}
}
ITEM
}

resource "aws_dynamodb_table_item" "user_andrea" {
  table_name = aws_dynamodb_table.users.name
  hash_key   = "userId"

  item = <<ITEM
{
  "userId": {"S": "15f1c60a-2833-49b7-8660-065b58be2f89"},
  "name": {"S": "Andrea"},
  "lastName": {"S": "Vargas"}
}
ITEM
}

resource "aws_dynamodb_table" "activity" {
  name         = "activity"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "activityId"

  attribute {
    name = "activityId"
    type = "S"
  }

  attribute {
    name = "transactionId"
    type = "S"
  }

  attribute {
    name = "date"
    type = "S" # DynamoDB does not have a native date type, so dates are stored as strings (e.g., ISO 8601 format).
  }

  global_secondary_index {
    name            = "TransactionIdndex"
    hash_key        = "transactionId"
    projection_type = "ALL" # Index all attributes in the projection
    read_capacity   = 5
    write_capacity  = 5
  }

  global_secondary_index {
    name            = "DateIndex"
    hash_key        = "date"
    projection_type = "ALL" # Index all attributes in the projection
    read_capacity   = 5
    write_capacity  = 5
  }

  tags = {
    Name = "activity"
  }
}

# IAM Policy to allow Lambda to write logs to CloudWatch
resource "aws_iam_policy" "lambda_logging_policy" {
  name        = "lambda_logging_policy"
  description = "IAM policy to allow Lambda to write logs to CloudWatch"

  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Action = [
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:PutLogEvents"
        ],
        Effect   = "Allow",
        Resource = "*"
      }
    ]
  })
}

# Attach the IAM policy to the IAM role
resource "aws_iam_role_policy_attachment" "lambda_logs_attach" {
  role       = aws_iam_role.lambda_role.name
  policy_arn = aws_iam_policy.lambda_logging_policy.arn
}


# DynamoDB IAM Policy
resource "aws_iam_policy" "dynamodb_policy" {
  name        = "DynamoDBPolicy"
  description = "Policy for accessing DynamoDB tables"
  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect = "Allow",
        Action = [
          "dynamodb:GetItem",
          "dynamodb:Query"
        ],
        Resource = [
          aws_dynamodb_table.users.arn,
          aws_dynamodb_table.transactions.arn,
          aws_dynamodb_table.activity.arn
        ]
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "dynamodb_policy_attachment" {
  role       = aws_iam_role.execution_role.name
  policy_arn = aws_iam_policy.dynamodb_policy.arn
}

# Create IAM Role for Lambda
resource "aws_iam_role" "lambda_role" {
  name = "lambda_execution_role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action = "sts:AssumeRole"
      Effect = "Allow"
      Principal = {
        Service = "lambda.amazonaws.com"
      }
    }]
  })
}

# Attach Basic Lambda Execution Role Policy
resource "aws_iam_role_policy_attachment" "lambda_policy" {
  role       = aws_iam_role.lambda_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

# Lambda Function for GET
resource "aws_lambda_function" "transaction_lambda_function" {
  filename         = "packages/transaction_lambda_function.zip"
  function_name    = "get-transaction"
  role             = aws_iam_role.lambda_role.arn
  handler          = "dist/transactionHandler.handler"
  runtime          = "nodejs18.x"
  source_code_hash = filebase64sha256("packages/transaction_lambda_function.zip")
}

# Lambda Function for POST
resource "aws_lambda_function" "payment_lambda_function" {
  filename         = "packages/payment_lambda_function.zip"
  function_name    = "execute-payments"
  role             = aws_iam_role.lambda_role.arn
  handler          = "dist/paymentHandler.handler"
  runtime          = "nodejs18.x"
  source_code_hash = filebase64sha256("packages/payment_lambda_function.zip")
}

# Lambda Function for POST
resource "aws_lambda_function" "activity_lambda_function" {
  filename         = "packages/activity_lambda_function.zip"
  function_name    = "register-activity"
  role             = aws_iam_role.lambda_role.arn
  handler          = "dist/activitytHandler.handler"
  runtime          = "nodejs18.x"
  source_code_hash = filebase64sha256("packages/activity_lambda_function.zip")
}

# DynamoDB Stream to Lambda Trigger
resource "aws_lambda_event_source_mapping" "dynamodb_to_lambda" {
  event_source_arn  = aws_dynamodb_table.transactions.stream_arn
  function_name     = aws_lambda_function.activity_lambda_function.arn
  starting_position = "LATEST"
}

resource "aws_iam_role" "execution_role" {
  name               = "step_function_execution_role"
  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": "sts:AssumeRole",
      "Principal": {
        "Service": "states.amazonaws.com"
      },
      "Effect": "Allow",
      "Sid": ""
    }
  ]
}
EOF
}

resource "aws_sfn_state_machine" "payment_step_function" {
  name     = "paymentStateMachine"
  role_arn = aws_iam_role.execution_role.arn
  definition = jsonencode({
    Comment = "A Step Function that validates input, checks if the user exists, and returns a transactionId message or an error",
    StartAt = "ValidateInput",
    States = {
      ValidateInput = {
        Type = "Choice",
        Choices = [
          {
            And = [
              { Variable = "$.userId", IsPresent = true },
              { Variable = "$.amount", IsPresent = true }
            ],
            Next = "PrintUserId"
          }
        ],
        Default = "InvalidInput"
      },
      PrintUserId = {
        Type = "Pass",
        Result = {
          "userId" : "$.userId"
        },
        ResultPath = "$.result",
        Next       = "CheckIfUserExists"
      },
      CheckIfUserExists = {
        Type     = "Task",
        Resource = "arn:aws:states:::dynamodb:getItem",
        Parameters = {
          TableName = "${aws_dynamodb_table.users.name}",
          Key = {
            userId = {
              S = "$.userId"
            }
          }
        },
        ResultPath = "$.user",
        Next       = "UserExists"
      },
      UserExists = {
        Type = "Choice",
        Choices = [
          {
            Variable  = "$.user.Item.userId.S",
            IsPresent = true,
            Next      = "InvokePaymentLambda"
          }
        ],
        Default = "UserNotFound"
      },
      InvokePaymentLambda = {
        Type     = "Task",
        Resource = aws_lambda_function.payment_lambda_function.arn,
        Parameters = {
          amount = "$.amount"
        },
        ResultPath = "$.paymentResult",
        Next       = "ReturnHelloWorld"
      },
      InsertTransactionRecord = {
        Type     = "Task",
        Resource = "arn:aws:states:::dynamodb:putItem",
        Parameters = {
          TableName = "${aws_dynamodb_table.transactions.name}",
          Item = {
            transactionId = {
              S = "$.paymentResult.transactionId"
            },
            userId = {
              S = "$.userId"
            },
            amount = {
              N = "$.amount"
            }
          }
        },
        ResultPath = "$.transactionResult",
        Next       = "ReturnSuccess"
      },
      ReturnSuccess = {
        Type = "Pass",
        Result = {
          "message" : "Transaction recorded successfully"
        },
        ResultPath = "$.result",
        End        = true
      },
      InvalidInput = {
        Type  = "Fail",
        Error = "ValidationError",
        Cause = "The userId or amount field is missing"
      },
      UserNotFound = {
        Type  = "Fail",
        Error = "UserNotFound",
        Cause = "The userId does not exist in the users table"
      }
    }
  })
}

# API Gateway Setup
resource "aws_api_gateway_rest_api" "api_gateway" {
  name        = "io_company_api"
  description = "API Gateway for handling IO company requests"
}



# Resource for Step Function
resource "aws_api_gateway_resource" "step_function_resource" {
  rest_api_id = aws_api_gateway_rest_api.api_gateway.id
  parent_id   = aws_api_gateway_rest_api.api_gateway.root_resource_id
  path_part   = "payments"
}

resource "aws_api_gateway_method" "post_method_step_function" {
  rest_api_id   = aws_api_gateway_rest_api.api_gateway.id
  resource_id   = aws_api_gateway_resource.step_function_resource.id
  http_method   = "POST"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "step_function_integration" {
  rest_api_id             = aws_api_gateway_rest_api.api_gateway.id
  resource_id             = aws_api_gateway_resource.step_function_resource.id
  http_method             = aws_api_gateway_method.post_method_step_function.http_method
  type                    = "AWS"
  integration_http_method = "POST"
  uri                     = "arn:aws:apigateway:${var.region}:states:action/StartSyncExecution"

  request_templates = {
    "application/json" = <<EOF
{
  "stateMachineArn": "${aws_sfn_state_machine.payment_step_function.arn}",
  "input": {
    #if($input.path('$.userId'))
      "userId": "$input.path('$.userId')",
    #end
    #if($input.path('$.amount'))
      "amount": "$input.path('$.amount')"
    #end

  }
}
EOF
  }

  passthrough_behavior = "WHEN_NO_MATCH"
}

# Resource path /get
resource "aws_api_gateway_resource" "transaction_resource" {
  rest_api_id = aws_api_gateway_rest_api.api_gateway.id
  parent_id   = aws_api_gateway_rest_api.api_gateway.root_resource_id
  # path_part   = "v1/transactions"
  path_part = "transactions"
}

# GET Method for GET Lambda
resource "aws_api_gateway_method" "get_method" {
  rest_api_id   = aws_api_gateway_rest_api.api_gateway.id
  resource_id   = aws_api_gateway_resource.transaction_resource.id
  http_method   = "GET"
  authorization = "NONE"
}

# Integration for GET Lambda
resource "aws_api_gateway_integration" "get_integration" {
  rest_api_id             = aws_api_gateway_rest_api.api_gateway.id
  resource_id             = aws_api_gateway_resource.transaction_resource.id
  http_method             = aws_api_gateway_method.get_method.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = aws_lambda_function.transaction_lambda_function.invoke_arn
}


# Permissions for GET Lambda
resource "aws_lambda_permission" "get_permission" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.transaction_lambda_function.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_api_gateway_rest_api.api_gateway.execution_arn}/*/GET/get"
}



# Deploy the API
resource "aws_api_gateway_deployment" "api_deployment" {
  depends_on = [
    aws_api_gateway_integration.step_function_integration,
    aws_api_gateway_integration.get_integration,
  ]

  rest_api_id = aws_api_gateway_rest_api.api_gateway.id
  stage_name  = "dev"
}

output "get_api_endpoint" {
  value = "${aws_api_gateway_deployment.api_deployment.invoke_url}/transactions"
}

output "post_api_endpoint" {
  value = "${aws_api_gateway_deployment.api_deployment.invoke_url}/payments"
}

