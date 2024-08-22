variable "table_name_activity" {
  description = "The name of the transactions table"
  type        = string
  default     = "transactions"
}

variable "lambda_bucket_name" {
  description = "Name of the S3 bucket used to store function code."
  type        = string
}

variable "table_transactions_stream_arn" {
  description = "The ARN of the DynamoDB stream of table Transaccion"
  type        = string
}
