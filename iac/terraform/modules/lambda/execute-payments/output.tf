output "function_name" {
  description = "Name of the Lambda function."
  value = aws_lambda_function.lambda_execute_payments.function_name
}

output "invoke_arn" {
  value = aws_lambda_function.lambda_execute_payments.invoke_arn
}
