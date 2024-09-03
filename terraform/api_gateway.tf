resource "aws_api_gateway_rest_api" "api" {
  name        = "API Gateway for Bank Application"
  description = "API for account and transaction management"
}

resource "aws_api_gateway_resource" "accounts" {
  rest_api_id = aws_api_gateway_rest_api.api.id
  parent_id   = aws_api_gateway_rest_api.api.root_resource_id
  path_part   = "accounts"
}

resource "aws_api_gateway_resource" "account_id" {
  rest_api_id = aws_api_gateway_rest_api.api.id
  parent_id   = aws_api_gateway_resource.accounts.id
  path_part   = "{accountId}"
}

resource "aws_api_gateway_method" "get_account" {
  rest_api_id   = aws_api_gateway_rest_api.api.id
  resource_id   = aws_api_gateway_resource.account_id.id
  http_method   = "GET"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "get_account" {
  rest_api_id = aws_api_gateway_rest_api.api.id
  resource_id = aws_api_gateway_resource.account_id.id
  http_method = aws_api_gateway_method.get_account.http_method
  type        = "AWS_PROXY"
  integration_http_method = "POST"
  uri         = aws_lambda_function.get_account.invoke_arn
}

resource "aws_api_gateway_resource" "payments" {
  rest_api_id = aws_api_gateway_rest_api.api.id
  parent_id   = aws_api_gateway_rest_api.api.root_resource_id
  path_part   = "payments"
}

resource "aws_api_gateway_method" "post_payment" {
  rest_api_id   = aws_api_gateway_rest_api.api.id
  resource_id   = aws_api_gateway_resource.payments.id
  http_method   = "POST"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "post_payment" {
  rest_api_id = aws_api_gateway_rest_api.api.id
  resource_id = aws_api_gateway_resource.payments.id
  http_method = aws_api_gateway_method.post_payment.http_method
  type        = "AWS"
  integration_http_method = "POST"
  uri         = "arn:aws:apigateway:${var.region}:states:action/StartExecution"
  credentials = var.devops_role_arn
  request_templates = {
    "application/json" = <<EOF
{
  "input": "{\"body\": $util.escapeJavaScript($input.json('$'))}",
  "stateMachineArn": "${aws_sfn_state_machine.payment_state_machine.arn}"
}
EOF
  }
  passthrough_behavior = "WHEN_NO_MATCH"
}

resource "aws_api_gateway_method_response" "post_payment_200" {
  rest_api_id = aws_api_gateway_rest_api.api.id
  resource_id = aws_api_gateway_resource.payments.id
  http_method = aws_api_gateway_method.post_payment.http_method
  status_code = "200"

  response_models = {
    "application/json" = "Empty"
  }
}

resource "aws_api_gateway_integration_response" "post_payment_200" {
  rest_api_id = aws_api_gateway_rest_api.api.id
  resource_id = aws_api_gateway_resource.payments.id
  http_method = aws_api_gateway_method.post_payment.http_method
  status_code = "200"
  response_templates = {
    "application/json" = <<EOF
#set($inputRoot = $input.path('$'))
{
  "message": "$inputRoot.message",
  "transactionId": "$inputRoot.transactionId"
}
EOF
  }
}

resource "aws_api_gateway_method_response" "post_payment_201" {
  rest_api_id = aws_api_gateway_rest_api.api.id
  resource_id = aws_api_gateway_resource.payments.id
  http_method = aws_api_gateway_method.post_payment.http_method
  status_code = "201"

  response_models = {
    "application/json" = "Empty"
  }
}

resource "aws_api_gateway_integration_response" "post_payment_201" {
  rest_api_id = aws_api_gateway_rest_api.api.id
  resource_id = aws_api_gateway_resource.payments.id
  http_method = aws_api_gateway_method.post_payment.http_method
  status_code = "201"
  response_templates = {
    "application/json" = <<EOF
#set($inputRoot = $input.path('$'))
{
  "message": "Payment registered successfully",
  "transactionId": "$inputRoot.transactionCode"
}
EOF
  }
}

resource "aws_api_gateway_method_response" "post_payment_400" {
  rest_api_id = aws_api_gateway_rest_api.api.id
  resource_id = aws_api_gateway_resource.payments.id
  http_method = aws_api_gateway_method.post_payment.http_method
  status_code = "400"

  response_models = {
    "application/json" = "Empty"
  }
}

resource "aws_api_gateway_integration_response" "post_payment_400" {
  rest_api_id = aws_api_gateway_rest_api.api.id
  resource_id = aws_api_gateway_resource.payments.id
  http_method = aws_api_gateway_method.post_payment.http_method
  status_code = "400"
  selection_pattern = ".*"
  response_templates = {
    "application/json" = <<EOF
{
  "message": "Something was wrong"
}
EOF
  }
}

resource "aws_api_gateway_method_response" "post_payment_500" {
  rest_api_id = aws_api_gateway_rest_api.api.id
  resource_id = aws_api_gateway_resource.payments.id
  http_method = aws_api_gateway_method.post_payment.http_method
  status_code = "500"

  response_models = {
    "application/json" = "Empty"
  }
}

resource "aws_api_gateway_integration_response" "post_payment_500" {
  rest_api_id = aws_api_gateway_rest_api.api.id
  resource_id = aws_api_gateway_resource.payments.id
  http_method = aws_api_gateway_method.post_payment.http_method
  status_code = "500"
  selection_pattern = ".*"
  response_templates = {
    "application/json" = <<EOF
{
  "message": "Internal Server Error"
}
EOF
  }
}