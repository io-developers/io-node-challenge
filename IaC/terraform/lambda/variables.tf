variable "payments_lambda_name" {
  description = "Lambda name for payments app"
  default     = "execute-payments"
}

variable "activity_lambda_name" {
  description = "Lambda name for activity app"
  default     = "register-activity"
}

variable "transaction_lambda_name" {
  description = "Lambda name for transaction app"
  default     = "get-transaction"
}

variable "mocks_lambda_name" {
  description = "Lambda name for mocks app"
  default     = "execute-mock-payments"
}

variable "zip_activity_lambda_output_path" {}

variable "zip_mocks_lambda_output_path" {}

variable "zip_payments_lambda_output_path" {}

variable "zip_transaction_lambda_output_path" {}

variable "zip_activity_lambda_output_base64" {}

variable "zip_mocks_lambda_output_base64" {}

variable "zip_payments_lambda_output_base64" {}

variable "zip_transaction_lambda_output_base64" {}


// Dynamodb tables name's
variable "transactions_table_name" {}
variable "activity_table_name" {}
variable "users_table_name" {}

variable "aws_region" {}

variable "api_gateway_url" {}

//Dynamodb Stream arn
variable "transactions_table_stream_arn" {}