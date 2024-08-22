
# Create an integration between the API Gateway and the Lambda Get-Transaction
resource "aws_apigatewayv2_integration" "get_transactions" {
  api_id = aws_apigatewayv2_api.api_bcp_challenged.id

  integration_uri    = var.lambda_get_transaction_invoke_arn
  integration_type   = "AWS_PROXY"
  integration_method = "POST"
}

resource "aws_apigatewayv2_route" "get_transactions" {
  api_id = aws_apigatewayv2_api.api_bcp_challenged.id

  route_key = "GET /v1/transactions"
  target    = "integrations/${aws_apigatewayv2_integration.get_transactions.id}"
}
#END
