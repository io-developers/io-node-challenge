# resource "aws_apigatewayv2_integration_response" "_integration_response" {
#   api_id                   = aws_apigatewayv2_api.api.id
#   integration_id           = aws_apigatewayv2_integration.transaction.id
#   integration_response_key = "/200/"
#   response_templates = {
#     "application/json" = jsonencode({
#       "message": "Payment registered successfully",
#       "transactionId": "8db0a6fc-ad42-4974-ac1f-36bb90730afe"
#     })
#   }
# }