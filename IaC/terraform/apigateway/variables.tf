variable "proyect_name" {
  description = "Name of proyect"
}

variable "step_function_invoke_arn" {
  description = "Arn of main Step Function to invoke from apigateway"
}

variable "lambda_mocks_invoke_arn" {
  description = "Arn of mocks lambda to invoke from apigateway"
}

variable "lambda_transaction_invoke_arn" {
  description = "Arn of transaction lambda to invoke from apigateway"
}


variable "lambda_mocks_function_name" {
  description = "Lambda function name of mocks lambda"
}

variable "lambda_transaction_function_name" {
  description = "Lambda function name of transaction lambda"
}