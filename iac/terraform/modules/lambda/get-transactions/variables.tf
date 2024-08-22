variable "lambda_get_transactions" {
  description = "Query for the transaction id in the transactions table"
  type        = string
  default     = "get-transactions"
}

variable "table_name_transactions" {
  description = "The name of the transactions table"
  type        = string
  default     = "transactions"
}

variable "lambda_bucket_name" {
  description = "Name of the S3 bucket used to store function code."
  type        = string
}
