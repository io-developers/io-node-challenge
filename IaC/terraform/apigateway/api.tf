resource "aws_apigatewayv2_api" "api" {
  name          = "api-io-node-challenge"
  protocol_type = "HTTP"
}
