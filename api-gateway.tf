# Crear el API Gateway REST
resource "aws_api_gateway_rest_api" "my_api" {
  name        = "io-api-prd"
  description = "API Gateway REST API for invoking Step Functions and Lambda"
}

# Crear el recurso del API Gateway para payments
resource "aws_api_gateway_resource" "payments" {
  rest_api_id = aws_api_gateway_rest_api.my_api.id
  parent_id   = aws_api_gateway_rest_api.my_api.root_resource_id
  path_part   = "payments"
}

# Crear el recurso del API Gateway para accounts
resource "aws_api_gateway_resource" "accounts" {
  rest_api_id = aws_api_gateway_rest_api.my_api.id
  parent_id   = aws_api_gateway_rest_api.my_api.root_resource_id
  path_part   = "accounts"
}

// Unit
resource "aws_api_gateway_resource" "account" {
  rest_api_id = aws_api_gateway_rest_api.my_api.id
  parent_id   = aws_api_gateway_resource.accounts.id
  path_part   = "{accountId}"
}


# Crear el metodo POST para el recurso payments
resource "aws_api_gateway_method" "post_payment" {
  rest_api_id   = aws_api_gateway_rest_api.my_api.id
  resource_id   = aws_api_gateway_resource.payments.id
  http_method   = "POST"
  authorization = "NONE"
}

# Crear el metodo GET para el recurso accounts
resource "aws_api_gateway_method" "get_account" {
  rest_api_id   = aws_api_gateway_rest_api.my_api.id
  resource_id   = aws_api_gateway_resource.account.id
  http_method   = "GET"
  authorization = "NONE"
  request_parameters = {
    "method.request.path.accountId" = true
  }
}

# Crear la integración de la Step Function con el API Gateway para payments
resource "aws_api_gateway_integration" "post_payment" {
  rest_api_id             = aws_api_gateway_rest_api.my_api.id
  resource_id             = aws_api_gateway_resource.payments.id
  http_method             = aws_api_gateway_method.post_payment.http_method
  integration_http_method = "POST"
  type                    = "AWS"
  uri                     = "arn:aws:apigateway:${var.aws_region}:states:action/StartExecution"
  credentials             = aws_iam_role.apigateway_stepfunctions_role.arn
  request_templates = {
    "application/json" = <<EOF
{
  "input": "$util.escapeJavaScript($input.json('$'))",
  "stateMachineArn": "${aws_sfn_state_machine.sfn_state_machine.arn}"
}
EOF
  }
  passthrough_behavior = "WHEN_NO_MATCH"
}

# Crear la integración de la función Lambda con el API Gateway para accounts
resource "aws_api_gateway_integration" "get_account" {
  rest_api_id             = aws_api_gateway_rest_api.my_api.id
  resource_id             = aws_api_gateway_resource.account.id
  http_method             = aws_api_gateway_method.get_account.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = aws_lambda_function.get-account.invoke_arn
}

# Crear la respuesta del metodo POST para payments
resource "aws_api_gateway_method_response" "post_payment_200" {
  rest_api_id = aws_api_gateway_rest_api.my_api.id
  resource_id = aws_api_gateway_resource.payments.id
  http_method = aws_api_gateway_method.post_payment.http_method
  status_code = "200"
}

# Crear la respuesta del metodo GET para account
resource "aws_api_gateway_method_response" "get_account_200" {
  rest_api_id = aws_api_gateway_rest_api.my_api.id
  resource_id = aws_api_gateway_resource.account.id
  http_method = aws_api_gateway_method.get_account.http_method
  status_code = "200"
}

# Crear la respuesta de integración para POST payments
resource "aws_api_gateway_integration_response" "post_payment_200" {
  rest_api_id = aws_api_gateway_rest_api.my_api.id
  resource_id = aws_api_gateway_resource.payments.id
  http_method = aws_api_gateway_method.post_payment.http_method
  status_code = aws_api_gateway_method_response.post_payment_200.status_code
}

# Crear la respuesta de integración para GET account
resource "aws_api_gateway_integration_response" "get_account_200" {
  rest_api_id = aws_api_gateway_rest_api.my_api.id
  resource_id = aws_api_gateway_resource.account.id
  http_method = aws_api_gateway_method.get_account.http_method
  status_code = aws_api_gateway_method_response.get_account_200.status_code
}

# Crear el deployment del API Gateway
resource "aws_api_gateway_deployment" "my_api_deployment" {
  rest_api_id = aws_api_gateway_rest_api.my_api.id
  depends_on = [
    aws_api_gateway_integration.post_payment,
    aws_api_gateway_integration.get_account
  ]
}

# Crear la etapa del API Gateway
resource "aws_api_gateway_stage" "my_api_stage" {
  rest_api_id   = aws_api_gateway_rest_api.my_api.id
  deployment_id = aws_api_gateway_deployment.my_api_deployment.id
  stage_name    = "v1"
}

# Crear el rol de IAM para la integración de API Gateway con Step Functions
resource "aws_iam_role" "apigateway_stepfunctions_role" {
  name               = "apigateway_stepfunctions_role"
  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "apigateway.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
EOF
}

# Adjuntar la política de permisos al rol de integración de API Gateway con Step Functions
resource "aws_iam_role_policy" "apigateway_stepfunctions_policy" {
  role   = aws_iam_role.apigateway_stepfunctions_role.id
  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": "states:StartExecution",
      "Resource": "${aws_sfn_state_machine.sfn_state_machine.arn}"
    }
  ]
}
EOF
}