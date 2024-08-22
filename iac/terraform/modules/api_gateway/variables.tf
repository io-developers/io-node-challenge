variable "lambda_get_transaction_invoke_arn" {
  description = "Arn of get-transactions lambda to invoke from api-gateway"
}

variable "lambda_get_transaction_function_name" {
  description = "Lambda function name of get-transaction lambda"
}

variable "lambda_api_mock_invoke_arn" {
  description = "Arn of api-mock lambda to invoke from api-gateway"
}

variable "lambda_api_mock_function_name" {
  description = "Lambda function name of api-mock lambda"
}

variable "lambda_execute_payment_invoke_arn" {
  description = "Arn of execute-payment lambda to invoke from api-gateway"
}

variable "lambda_execute_payment_function_name" {
  description = "Lambda function name of execute-payment lambda"
}

variable "step_function_invoke_arn" {
  description = "Arn of the Step Function."
}
