output "api_gateway_endpoint" {
  description = "The URL of the API Gateway endpoint"
  value       = "${aws_api_gateway_rest_api.api.invoke_url}/v1"
}
