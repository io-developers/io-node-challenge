# Create an integration between the API Gateway and the Lambda Get-Transaction
resource "aws_apigatewayv2_integration" "api_mock" {
  api_id = aws_apigatewayv2_api.api_bcp_challenged.id

  integration_uri    = var.lambda_api_mock_invoke_arn
  integration_type   = "AWS_PROXY"
  integration_method = "POST"
}

resource "aws_apigatewayv2_route" "api_mock" {
  api_id = aws_apigatewayv2_api.api_bcp_challenged.id

  route_key = "POST /mock-transaction"
  target    = "integrations/${aws_apigatewayv2_integration.api_mock.id}"
}
#END
