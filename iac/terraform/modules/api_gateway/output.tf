output "base_url" {
  description = "Base URL for API Gateway stage."

  value = aws_apigatewayv2_stage.api_bcp_challenged.invoke_url
}

output "invoke_arn" {
  value = aws_apigatewayv2_api.api_bcp_challenged.arn
}
