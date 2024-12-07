resource "aws_lambda_function" "io-node-challenge-mock-payment" {
  function_name = "io-node-challenge-mock-payment"
  filename      = "${path.module}/lambda.zip"
  handler       = "dist/src/mockPayments/infrastructure/index.processPayment"
  runtime       = "nodejs20.x"

  role = aws_iam_role.lambda_execution_role.arn

  source_code_hash = filebase64sha256("${path.module}/lambda.zip")

  environment {
    variables = {
    }
  }
}


resource "aws_lambda_layer_version" "lambda_layer_prod" {
  filename   = "${path.module}/layer.zip"
  layer_name = "lambda_layer_prod"

  compatible_runtimes = ["nodejs20.x"]
}


resource "aws_lambda_function" "io-node-challenge-payment" {
  function_name = "io-node-challenge-payment"
  filename      = "${path.module}/lambda.zip"
  handler       = "dist/src/payments/infrastructure/index.paymentTransaction"
  runtime       = "nodejs20.x"

  role = aws_iam_role.lambda_execution_role.arn

  source_code_hash = filebase64sha256("${path.module}/lambda.zip")

  environment {
    variables = {
      API_MOCK_URL      = "https://run.mocky.io/v3/20a586d4-e8a3-4785-b4cc-fbdaf66ea9d6"
      TRANSACTION_TABLE = "io-node-challenge-transaction"
    }
  }

  layers = [aws_lambda_layer_version.lambda_layer_prod.arn]
}



#lambda functions

resource "aws_lambda_function" "io-node-challenge-user" {
  function_name = "io-node-challenge-user"
  filename      = "${path.module}/lambda.zip"
  handler       = "dist/src/user/infrastructure/index.validateUser"
  runtime       = "nodejs20.x"

  role = aws_iam_role.lambda_execution_role.arn

  source_code_hash = filebase64sha256("${path.module}/lambda.zip")

  environment {
    variables = {
      USER_TABLE = "io-node-challenge-user"
    }
  }

  layers = [aws_lambda_layer_version.lambda_layer_prod.arn]
}

resource "aws_lambda_function" "io-node-challenge-activity" {
  function_name = "io-node-challenge-activity"
  filename      = "${path.module}/lambda.zip"
  handler       = "dist/src/activity/infrastructure/index.activityProcess"
  runtime       = "nodejs20.x"

  role = aws_iam_role.lambda_execution_role.arn

  source_code_hash = filebase64sha256("${path.module}/lambda.zip")

  environment {
    variables = {
      USER_TABLE = "io-node-challenge-user"
    }
  }

  layers = [aws_lambda_layer_version.lambda_layer_prod.arn]
}

resource "aws_lambda_function" "io-node-challenge-start-process" {
  function_name = "io-node-challenge-start-process"
  filename      = "${path.module}/lambda.zip"
  handler       = "dist/src/payments/infrastructure/indexInit.startProcess"
  runtime       = "nodejs20.x"

  role = aws_iam_role.lambda_execution_role.arn

  source_code_hash = filebase64sha256("${path.module}/lambda.zip")

  environment {
    variables = {
      STATE_FUNCTION = "${aws_sfn_state_machine.state_machine.arn}"
    }
  }

  layers = [aws_lambda_layer_version.lambda_layer_prod.arn]
}




resource "aws_iam_role" "lambda_execution_role" {
  name = "lambda_execution_role_5"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "lambda.amazonaws.com"
        }
      },
    ]
  })
}

resource "aws_iam_role_policy" "lambda_execution_policy" {
  name = "lambda_execution_policy"
  role = aws_iam_role.lambda_execution_role.id
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        "Action" : [
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:PutLogEvents",
          "states:*"
        ],
        "Effect" : "Allow",
        "Resource" : [
          "arn:aws:logs:*:*:*",
          "*"
        ]
      },
      {
        Action = [
          "dynamodb:GetItem",
          "dynamodb:PutItem",
          "dynamodb:UpdateItem",
          "dynamodb:Scan",
          "dynamodb:Query",
          "dynamodb:ListStreams",
          "dynamodb:GetRecords",
          "dynamodb:GetShardIterator",
          "dynamodb:DescribeStream"
        ]
        Effect   = "Allow"
        Resource = "*"
      },
      {
        Action = [
          "lambda:ListLayers",
          "lambda:GetLayerVersion"
        ]
        Effect   = "Allow"
        Resource = "*"
      }
    ]
  })
}




#config of api gateway

resource "aws_apigatewayv2_api" "gateway" {
  name          = "api-io-node-challenge"
  protocol_type = "HTTP"
}


resource "aws_apigatewayv2_stage" "gateway" {
  api_id = aws_apigatewayv2_api.gateway.id

  name        = "serverless_lambda_stage"
  auto_deploy = true

  access_log_settings {
    destination_arn = aws_cloudwatch_log_group.api_gw.arn

    format = jsonencode({
      requestId               = "$context.requestId"
      sourceIp                = "$context.identity.sourceIp"
      requestTime             = "$context.requestTime"
      protocol                = "$context.protocol"
      httpMethod              = "$context.httpMethod"
      resourcePath            = "$context.resourcePath"
      routeKey                = "$context.routeKey"
      status                  = "$context.status"
      responseLength          = "$context.responseLength"
      integrationErrorMessage = "$context.integrationErrorMessage"
      }
    )
  }
}


# api mock payment config

resource "aws_apigatewayv2_integration" "mockpayment" {
  api_id = aws_apigatewayv2_api.gateway.id

  integration_uri    = aws_lambda_function.io-node-challenge-mock-payment.invoke_arn
  integration_type   = "AWS_PROXY"
  integration_method = "POST"
}

resource "aws_apigatewayv2_route" "mockpayment" {
  api_id = aws_apigatewayv2_api.gateway.id

  route_key = "POST /mockPayment"
  target    = "integrations/${aws_apigatewayv2_integration.mockpayment.id}"
}

resource "aws_cloudwatch_log_group" "api_gw" {
  name = "/aws/api_gw/${aws_apigatewayv2_api.gateway.name}"

  retention_in_days = 30
}

resource "aws_lambda_permission" "api_gw" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.io-node-challenge-mock-payment.function_name
  principal     = "apigateway.amazonaws.com"

  source_arn = "${aws_apigatewayv2_api.gateway.execution_arn}/*/*"
}


#api start process with step function

resource "aws_apigatewayv2_integration" "start_process" {
  api_id = aws_apigatewayv2_api.gateway.id

  integration_uri    = aws_lambda_function.io-node-challenge-start-process.invoke_arn
  integration_type   = "AWS_PROXY"
  integration_method = "POST"
}

resource "aws_apigatewayv2_route" "start_process" {
  api_id = aws_apigatewayv2_api.gateway.id

  route_key = "POST /startprocess"
  target    = "integrations/${aws_apigatewayv2_integration.start_process.id}"
}

resource "aws_cloudwatch_log_group" "start_process" {
  name = "/aws/api_gw/${aws_apigatewayv2_api.gateway.name}/start"

  retention_in_days = 30
}

resource "aws_lambda_permission" "start_process" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.io-node-challenge-start-process.function_name
  principal     = "apigateway.amazonaws.com"

  source_arn = "${aws_apigatewayv2_api.gateway.execution_arn}/*/*"
}





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
  name       = "io-node-challente-state-machine-payment"
  role_arn   = aws_iam_role.step_functions_role.arn
  definition = <<DEFINITION
{
  "Comment": "State Machine to process transaction",
  "States": {
    "User Validate": {
      "Type": "Task",
      "Resource": "arn:aws:states:::lambda:invoke",
      "OutputPath": "$.Payload",
      "Parameters": {
        "Payload.$": "$",
        "FunctionName": "io-node-challenge-user"
      },
      "Retry": [
        {
          "ErrorEquals": [
            "Lambda.ServiceException",
            "Lambda.AWSLambdaException",
            "Lambda.SdkClientException",
            "Lambda.TooManyRequestsException"
          ],
          "IntervalSeconds": 1,
          "MaxAttempts": 3,
          "BackoffRate": 2
        }
      ],
      "Next": "UserValidateAnswer"
    },
    "UserValidateAnswer": {
      "Type": "Choice",
      "Choices": [
        {
          "Variable": "$.state",
          "BooleanEquals": false,
          "Next": "Fail"
        }
      ],
      "Default": "Pass"
    },
    "Pass": {
      "Type": "Pass",
      "Next": "Execute Payment",
      "InputPath": "$.data"
    },
    "Execute Payment": {
      "Type": "Task",
      "Resource": "arn:aws:states:::lambda:invoke",
      "OutputPath": "$.Payload",
      "Parameters": {
        "Payload.$": "$",
        "FunctionName": "io-node-challenge-payment"
      },
      "Retry": [
        {
          "ErrorEquals": [
            "Lambda.ServiceException",
            "Lambda.AWSLambdaException",
            "Lambda.SdkClientException",
            "Lambda.TooManyRequestsException"
          ],
          "IntervalSeconds": 1,
          "MaxAttempts": 3,
          "BackoffRate": 2
        }
      ],
      "Next": "Choice"
    },
    "Choice": {
      "Type": "Choice",
      "Choices": [
        {
          "Variable": "$.transactionId",
          "IsPresent": true,
          "Comment": "Process correct",
          "Next": "Success"
        }
      ],
      "Default": "Fail"
    },
    "Success": {
      "Type": "Succeed"
    },
    "Fail": {
      "Type": "Fail"
    }
  },
  "StartAt": "User Validate"
}
DEFINITION
}
