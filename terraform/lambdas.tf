data "aws_caller_identity" "current" {}

resource "aws_lambda_permission" "get_account_permission" {
  statement_id  = "AllowAPIGatewayInvokeGetAccount"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.get_account.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "arn:aws:execute-api:${var.region}:${data.aws_caller_identity.current.account_id}:${aws_api_gateway_rest_api.api.id}/*/*"
}

resource "aws_lambda_permission" "validate_account_permission" {
  statement_id  = "AllowAPIGatewayInvokeValidateAccount"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.validate_account.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "arn:aws:execute-api:${var.region}:${data.aws_caller_identity.current.account_id}:${aws_api_gateway_rest_api.api.id}/*/*"
}

resource "aws_lambda_permission" "apigateway_payments" {
  statement_id  = "AllowAPIGatewayPayments"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.execute_payment.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "arn:aws:execute-api:${var.region}:${data.aws_caller_identity.current.account_id}:${aws_api_gateway_rest_api.api.id}/*/*"
}

resource "aws_lambda_permission" "save_transaction_permission" {
  statement_id  = "AllowAPIGatewayInvokeSaveTransactions"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.save_transaction.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "arn:aws:execute-api:${var.region}:${data.aws_caller_identity.current.account_id}:${aws_api_gateway_rest_api.api.id}/*/*"
}



resource "aws_lambda_function" "get_account" {
  filename         = "../lambda-zip/ms-account.zip"
  function_name    = "getAccountHandler"
  role             = var.devops_role_arn
  handler          = "index.getAccountLambdaHandler"
  runtime          = "nodejs20.x"
  source_code_hash = filebase64sha256("../lambda-zip/ms-account.zip")
  environment {
    variables = {
      LAMBDA_AWS_REGION = var.region
      LAMBDA_AWS_ACCESS_KEY_ID = var.access_key
      LAMBDA_AWS_SECRET_ACCESS_KEY = var.secret_access_key
      ACCOUNT_TABLE_NAME = var.account_table_name
    }
  }
}

resource "aws_lambda_function" "validate_account" {
  filename         = "../lambda-zip/ms-account.zip"
  function_name    = "validateAccountHandler"
  role             = var.devops_role_arn
  handler          = "index.validateAccountLambdaHandler"
  runtime          = "nodejs20.x"
  source_code_hash = filebase64sha256("../lambda-zip/ms-account.zip")
  environment {
    variables = {
      LAMBDA_AWS_REGION = var.region
      LAMBDA_AWS_ACCESS_KEY_ID = var.access_key
      LAMBDA_AWS_SECRET_ACCESS_KEY = var.secret_access_key
      ACCOUNT_TABLE_NAME = var.account_table_name
    }
  }
}

resource "aws_lambda_function" "execute_payment" {
  filename         = "../lambda-zip/api-mock-transaction.zip"
  function_name    = "executePaymentHandler"
  role             = var.devops_role_arn
  handler          = "index.transactionProcessLambdaHandler"
  runtime          = "nodejs20.x"
  source_code_hash = filebase64sha256("../lambda-zip/api-mock-transaction.zip")
  timeout          = 10
}

resource "aws_lambda_function" "update_account" {
  filename         = "../lambda-zip/ms-account.zip"
  function_name    = "updateAccountHandler"
  role             = var.devops_role_arn
  handler          = "index.updateAccountDynamoStreamHandler"
  runtime          = "nodejs20.x"
  source_code_hash = filebase64sha256("../lambda-zip/ms-account.zip")
  timeout          = 30
  environment {
    variables = {
      LAMBDA_AWS_REGION = var.region
      LAMBDA_AWS_ACCESS_KEY_ID = var.access_key
      LAMBDA_AWS_SECRET_ACCESS_KEY = var.secret_access_key
      ACCOUNT_TABLE_NAME = var.account_table_name
    }
  }
}

resource "aws_lambda_function" "save_transaction" {
  filename         = "../lambda-zip/ms-transaction.zip"
  function_name    = "createTransactionHandler"
  role             = var.devops_role_arn
  handler          = "index.createTransactionLambdaHandler"
  runtime          = "nodejs20.x"
  source_code_hash = filebase64sha256("../lambda-zip/ms-transaction.zip")
  environment {
    variables = {
      LAMBDA_AWS_REGION = var.region
      LAMBDA_AWS_ACCESS_KEY_ID = var.access_key
      LAMBDA_AWS_SECRET_ACCESS_KEY = var.secret_access_key
      TRANSACTION_TABLE_NAME = var.transaction_table_name
    }
  }
}