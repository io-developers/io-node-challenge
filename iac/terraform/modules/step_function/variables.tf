variable "users_table" {
  description = "Users table that contains data on the users who can carry out a transaction"
  type        = string
}

variable "transactions_table" {
  description = "saves the record of each interaction with the transactions table"
  type        = string
}

variable "lambda_execution_payment" {
  description = "Lambda function that processes the payment"
  type        = string
}

variable "lambda_execute_payment_invoke_arn" {
  description = "Lambda function that processes the payment"
}

variable "table_users_arn" {
  description = "ARN of the users table"
}

variable "table_transactions_arn" {
  description = "ARN of the transactions table"
}
