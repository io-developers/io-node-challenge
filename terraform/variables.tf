variable "lambda_role_arn" {
  description = "The ARN of the IAM role for Lambda functions"
  type        = string
}

variable "lambda_function_memory" {
  description = "The memory size for Lambda functions"
  type        = number
  default     = 128
}

variable "lambda_function_timeout" {
  description = "The timeout in seconds for Lambda functions"
  type        = number
  default     = 30
}
