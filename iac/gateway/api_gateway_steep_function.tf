resource "aws_iam_role" "apigateway_stepfunctions_role" {
  name = "APIGatewayStepFunctionsRole"

  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Action = "sts:AssumeRole",
        Effect = "Allow",
        Principal = {
          Service = "apigateway.amazonaws.com"
        }
      }
    ]
  })
}

resource "aws_iam_policy" "apigateway_stepfunctions_policy" {
  name   = "APIGatewayStepFunctionsPolicy"
  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Action = [
          "states:StartExecution"
        ],
        Effect   = "Allow",
        Resource = "arn:aws:states:us-east-2:381492019810:stateMachine:user-state-machine"
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "apigateway_stepfunctions_role_policy_attachment" {
  role       = aws_iam_role.apigateway_stepfunctions_role.name
  policy_arn = aws_iam_policy.apigateway_stepfunctions_policy.arn
}


resource "aws_api_gateway_rest_api" "ExecutePaymentAPI" {
  name        = "ExecutePaymentAPI"
  description = "API to manage payments"
  endpoint_configuration {
    types = ["REGIONAL"]
  }
}

resource "aws_api_gateway_resource" "payment_resource" {
  rest_api_id = aws_api_gateway_rest_api.ExecutePaymentAPI.id
  parent_id   = aws_api_gateway_rest_api.ExecutePaymentAPI.root_resource_id
  path_part   = "payments"
}

resource "aws_api_gateway_method" "payment_method" {
  rest_api_id   = aws_api_gateway_rest_api.ExecutePaymentAPI.id
  resource_id   = aws_api_gateway_resource.payment_resource.id
  http_method   = "POST"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "payment_integration" {
  rest_api_id = aws_api_gateway_rest_api.ExecutePaymentAPI.id
  resource_id = aws_api_gateway_resource.payment_resource.id
  http_method = aws_api_gateway_method.payment_method.http_method
  type        = "AWS"
  uri         = "arn:aws:apigateway:us-east-2:states:action/StartExecution"

  integration_http_method = "POST"
  passthrough_behavior    = "WHEN_NO_MATCH"
  request_templates = {
    "application/json" = <<EOF
{
  "input": "$util.escapeJavaScript($input.json('$'))",
  "stateMachineArn": "arn:aws:states:us-east-2:381492019810:stateMachine:user-state-machine"
}
EOF
  }
  credentials = aws_iam_role.apigateway_stepfunctions_role.arn
}

resource "aws_api_gateway_deployment" "api_deployment_2" {
  depends_on = [aws_api_gateway_integration.payment_integration]

  rest_api_id = aws_api_gateway_rest_api.ExecutePaymentAPI.id
  stage_name  = "v1"
}