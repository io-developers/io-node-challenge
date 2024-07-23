output "function_name" {
  description = "Name of the Lambda function."

  value = aws_lambda_function.lambda_api_mock.function_name
}

output "invoke_arn" {
  value = aws_lambda_function.lambda_api_mock.invoke_arn
}
