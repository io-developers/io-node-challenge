#Create an HTTP API with API Gateway

resource "aws_apigatewayv2_api" "api_bcp_challenged" {
  name          = "bcp-challenged-apigatewayv2"
  protocol_type = "HTTP"
}

resource "aws_apigatewayv2_stage" "api_bcp_challenged" {
  api_id      = aws_apigatewayv2_api.api_bcp_challenged.id
  name        = "dev"
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

resource "aws_cloudwatch_log_group" "api_gw" {
  name = "/aws/api_gw/${aws_apigatewayv2_api.api_bcp_challenged.name}"

  retention_in_days = 30
}

resource "aws_lambda_permission" "api_gw_permission_get_transactions" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = var.lambda_get_transaction_function_name
  principal     = "apigateway.amazonaws.com"

  source_arn = "${aws_apigatewayv2_api.api_bcp_challenged.execution_arn}/*/*"
}

resource "aws_lambda_permission" "api_gw_permission_api_mock" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = var.lambda_api_mock_function_name
  principal     = "apigateway.amazonaws.com"

  source_arn = "${aws_apigatewayv2_api.api_bcp_challenged.execution_arn}/*/*"
}

