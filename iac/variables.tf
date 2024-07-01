variable "table_activity_arn" {
  description = "The ARN of the DynamoDB table user"
  type        = string
}

variable "table_transactions_arn" {
  description = "The ARN of the DynamoDB table user"
  type        = string
}

variable "table_users_arn" {
  description = "The ARN of the DynamoDB table user"
  type        = string
}


variable "public_subnet_1_id" {
  description = "public_subnet_1_id"
  type        = string
}

variable "lambda_sg_id" {
  description = "lambda_sg_id"
  type        = string
}

variable "lambda_arn_transaction" {
  description = "lambda_arn_transaction"
  type        = string
}
