// lambda arn's
output "lambda_payments_arn" {
  value = aws_lambda_function.payments.arn
}
// lambda arn's invoke
output "lambda_payments_arn_invoke" {
  value = aws_lambda_function.payments.invoke_arn
}
output "lambda_activity_arn_invoke" {
  value = aws_lambda_function.activity.invoke_arn
}
output "lambda_mocks_arn_invoke" {
  value = aws_lambda_function.mocks.invoke_arn
}
output "lambda_transaction_arn_invoke" {
  value = aws_lambda_function.transaction.invoke_arn
}


// lambda Name's
output "lambda_payments_function_name" {
  value = aws_lambda_function.payments.function_name
}

output "lambda_activity_function_name" {
  value = aws_lambda_function.activity.function_name
}

output "lambda_mocks_function_name" {
  value = aws_lambda_function.mocks.function_name
}

output "lambda_transaction_function_name" {
  value = aws_lambda_function.transaction.function_name
}