resource "aws_apigatewayv2_route" "mocks" {
  api_id = aws_apigatewayv2_api.api.id

  route_key = "POST /v1/mock-payments"
  target    = "integrations/${aws_apigatewayv2_integration.mocks.id}"
}

resource "aws_apigatewayv2_route" "transaction" {
  api_id = aws_apigatewayv2_api.api.id

  route_key = "GET /v1/transaction"
  target    = "integrations/${aws_apigatewayv2_integration.transaction.id}"
}

resource "aws_apigatewayv2_route" "payments" {
  api_id = aws_apigatewayv2_api.api.id

  route_key = "POST /v1/payments"
  target    = "integrations/${aws_apigatewayv2_integration.payments.id}"
}