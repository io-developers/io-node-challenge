provider "aws" {
  region = "us-east-1"
}

# Define el rol de IAM para las funciones Lambda
resource "aws_iam_role" "lambda_role" {
  name = "lambda_role"

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

# Define la política de IAM asociada al rol Lambda
resource "aws_iam_role_policy" "lambda_policy" {
  name = "lambda_policy"
  role = aws_iam_role.lambda_role.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = [
          "dynamodb:PutItem",
          "dynamodb:GetItem",
          "dynamodb:UpdateItem",
          "dynamodb:Scan"
        ]
        Effect = "Allow"
        Resource = [
          aws_dynamodb_table.accounts.arn,
          aws_dynamodb_table.transactions.arn
        ]
      },
      {
        Action = "logs:*"
        Effect = "Allow"
        Resource = "*"
      }
    ]
  })
}

# Define la tabla DynamoDB para cuentas
resource "aws_dynamodb_table" "accounts" {
  name          = "Accounts"
  billing_mode  = "PAY_PER_REQUEST"  # Uso de modo de facturación bajo demanda
  hash_key      = "id"

  attribute {
    name = "id"
    type = "S"
  }
}

# Define la tabla DynamoDB para transacciones
resource "aws_dynamodb_table" "transactions" {
  name          = "Transactions"
  billing_mode  = "PAY_PER_REQUEST"  # Uso de modo de facturación bajo demanda
  hash_key      = "source"
  range_key     = "id"

  attribute {
    name = "source"
    type = "S"
  }

  attribute {
    name = "id"
    type = "N"
  }
}

# Define la función Lambda para procesar pagos
resource "aws_lambda_function" "execute_payment" {
  function_name = "execute_payment"
  handler       = "src/lambdas/executePayment.executePayment"
  runtime       = "nodejs18.x"
  role          = aws_iam_role.lambda_role.arn

  s3_bucket = "your-bucket-name"
  s3_key    = "your-deployment-package.zip"

  environment {
    variables = {
      AWS_REGION                = "us-east-1"
      DYNAMO_ACCOUNTS_TABLE     = "Accounts"
      DYNAMO_TRANSACTIONS_TABLE = "Transactions"
    }
  }
}

# Define la función Lambda para consultar cuentas
resource "aws_lambda_function" "get_account" {
  function_name = "get_account"
  handler       = "src/lambdas/getAccount.getAccount"
  runtime       = "nodejs18.x"
  role          = aws_iam_role.lambda_role.arn

  s3_bucket = "your-bucket-name"
  s3_key    = "your-deployment-package.zip"

  environment {
    variables = {
      AWS_REGION                = "us-east-1"
      DYNAMO_ACCOUNTS_TABLE     = "Accounts"
      DYNAMO_TRANSACTIONS_TABLE = "Transactions"
    }
  }
}

# Define la API Gateway
resource "aws_api_gateway_rest_api" "api" {
  name        = "PaymentsAPI"
  description = "API for payment processing"
}

# Define el recurso para el endpoint /v1/payments
resource "aws_api_gateway_resource" "payments" {
  rest_api_id = aws_api_gateway_rest_api.api.id
  parent_id   = aws_api_gateway_rest_api.api.root_resource_id
  path_part   = "v1/payments"
}

# Define el método POST para el endpoint /v1/payments
resource "aws_api_gateway_method" "post_payments" {
  rest_api_id   = aws_api_gateway_rest_api.api.id
  resource_id   = aws_api_gateway_resource.payments.id
  http_method   = "POST"
  authorization = "NONE"

  integration {
    type                     = "AWS_PROXY"
    integration_http_method  = "POST"
    uri                      = "arn:aws:apigateway:${var.region}:lambda:path/2015-03-31/functions/${aws_lambda_function.execute_payment.arn}/invocations"
  }
}

# Define el recurso para el endpoint /v1/accounts
resource "aws_api_gateway_resource" "accounts" {
  rest_api_id = aws_api_gateway_rest_api.api.id
  parent_id   = aws_api_gateway_rest_api.api.root_resource_id
  path_part   = "v1/accounts"
}

# Define el método GET para el endpoint /v1/accounts/{accountId}
resource "aws_api_gateway_method" "get_account" {
  rest_api_id   = aws_api_gateway_rest_api.api.id
  resource_id   = aws_api_gateway_resource.accounts.id
  http_method   = "GET"
  authorization = "NONE"

  integration {
    type                     = "AWS_PROXY"
    integration_http_method  = "GET"
    uri                      = "arn:aws:apigateway:${var.region}:lambda:path/2015-03-31/functions/${aws_lambda_function.get_account.arn}/invocations"
  }
}

# Define permisos para que API Gateway invoque las funciones Lambda
resource "aws_lambda_permission" "allow_api_gateway_execute_payment" {
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.execute_payment.function_name
  principal     = "apigateway.amazonaws.com"
  statement_id  = "AllowAPIGatewayInvokeExecutePayment"
  source_arn    = "${aws_api_gateway_rest_api.api.execution_arn}/*/*"
}

resource "aws_lambda_permission" "allow_api_gateway_get_account" {
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.get_account.function_name
  principal     = "apigateway.amazonaws.com"
  statement_id  = "AllowAPIGatewayInvokeGetAccount"
  source_arn    = "${aws_api_gateway_rest_api.api.execution_arn}/*/*"
}
