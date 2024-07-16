resource "aws_apigatewayv2_integration" "payments" {
  api_id              = aws_apigatewayv2_api.api.id
  integration_type    = "AWS_PROXY"
  integration_subtype = "StepFunctions-StartSyncExecution"
  credentials_arn     = aws_iam_role.step_function_role.arn
  request_parameters = {
    "StateMachineArn" = var.step_function_invoke_arn
    "Input" : "$request.body"
  }
}

resource "aws_apigatewayv2_integration" "mocks" {
  api_id             = aws_apigatewayv2_api.api.id
  integration_uri    = var.lambda_mocks_invoke_arn
  integration_type   = "AWS_PROXY"
  integration_method = "POST"
}

resource "aws_apigatewayv2_integration" "transaction" {
  api_id             = aws_apigatewayv2_api.api.id
  integration_uri    = var.lambda_transaction_invoke_arn
  integration_type   = "AWS_PROXY"
  integration_method = "POST"
}
