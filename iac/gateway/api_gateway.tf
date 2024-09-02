resource "aws_api_gateway_rest_api" "api" {
  name        = "TransactionAPI"
  description = "API to manage transactions"
  endpoint_configuration {
    types = ["REGIONAL"]
  }
}

resource "aws_api_gateway_resource" "proxy_resource" {
  rest_api_id = aws_api_gateway_rest_api.api.id
  parent_id   = aws_api_gateway_rest_api.api.root_resource_id
  path_part   = "{proxy+}"
}


resource "aws_api_gateway_method" "proxy_method" {
  rest_api_id   = aws_api_gateway_rest_api.api.id
  resource_id   = aws_api_gateway_resource.proxy_resource.id
  http_method   = "ANY"
  authorization = "NONE"
}


resource "aws_api_gateway_integration" "proxy_integration" {
  rest_api_id = aws_api_gateway_rest_api.api.id
  resource_id = aws_api_gateway_resource.proxy_resource.id
  http_method = aws_api_gateway_method.proxy_method.http_method
  type        = "AWS_PROXY"
  uri         = "arn:aws:apigateway:us-east-2:lambda:path/2015-03-31/functions/arn:aws:lambda:us-east-2:381492019810:function:lambda-transactions/invocations"

  integration_http_method = "POST"
}

# API Gateway Deployment
resource "aws_api_gateway_deployment" "api_deployment" {
  rest_api_id = aws_api_gateway_rest_api.api.id
  stage_name  = "v1"

  depends_on = [aws_api_gateway_integration.proxy_integration]
}


