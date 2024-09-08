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
  rest_api_id             = aws_api_gateway_rest_api.api.id
  resource_id             = aws_api_gateway_resource.payments.id
  http_method             = aws_api_gateway_method.post_payment.http_method
  type                    = "AWS"
  integration_http_method = "POST"
  uri                     = "arn:aws:apigateway:${var.region}:states:action/StartSyncExecution"
  credentials             = var.devops_role_arn

  request_templates = {
    "application/json" = <<EOF
{
  "input": "$util.escapeJavaScript($input.json('$'))",
  "stateMachineArn": "${aws_sfn_state_machine.payment_state_machine.arn}"
}
EOF
  }
  passthrough_behavior = "WHEN_NO_MATCH"
}

resource "aws_api_gateway_method_response" "post_payment_200" {
  depends_on = [aws_api_gateway_integration.post_payment]
  rest_api_id = aws_api_gateway_rest_api.api.id
  resource_id = aws_api_gateway_resource.payments.id
  http_method = aws_api_gateway_method.post_payment.http_method
  status_code = "200"

  response_models = {
    "application/json" = "Empty"
  }
}

resource "aws_api_gateway_method_response" "post_payment_201" {
  depends_on = [aws_api_gateway_integration.post_payment]
  rest_api_id = aws_api_gateway_rest_api.api.id
  resource_id = aws_api_gateway_resource.payments.id
  http_method = aws_api_gateway_method.post_payment.http_method
  status_code = "201"

  response_models = {
    "application/json" = "Empty"
  }
}

resource "aws_api_gateway_method_response" "post_payment_400" {
  depends_on = [aws_api_gateway_integration.post_payment]
  rest_api_id = aws_api_gateway_rest_api.api.id
  resource_id = aws_api_gateway_resource.payments.id
  http_method = aws_api_gateway_method.post_payment.http_method
  status_code = "400"

  response_models = {
    "application/json" = "Empty"
  }
}

resource "aws_api_gateway_integration_response" "post_payment_response" {
  depends_on = [aws_api_gateway_integration.post_payment]

  rest_api_id = aws_api_gateway_rest_api.api.id
  resource_id = aws_api_gateway_resource.payments.id
  http_method = aws_api_gateway_method.post_payment.http_method
  status_code = "200"  # Agrega esta línea

  response_templates = {
    "application/json" = <<EOF
#if($input.path('$.status').toString().equals("SUCCEEDED"))
  #set($context.responseOverride.status = 201)
  #set($parsedPayload = $util.parseJson($input.path('$.output')))
  {
    "message": "Payment registered successfully",
    "transactionId": "$parsedPayload.transactionId"
  }
#else
  #if($input.path('$.status').toString().equals("FAILED"))
    #set($context.responseOverride.status = 400)
    {
      "message": "Something was wrong"
    }
  #else
    #set($context.responseOverride.status = 500)
    {
      "statusCode": 500,
      "errorType": "InternalServer",
      "message": "Internal Server Error"
    }
  #end
#end
EOF
  }
}