output "payment_lambda_function_name" {
  value = aws_lambda_function.payment_lambda.function_name
}

output "transaction_lambda_function_name" {
  value = aws_lambda_function.transaction_lambda.function_name
}

output "api_gateway_url" {
  value = "${aws_api_gateway_rest_api.api.execution_arn}/payments"
}
