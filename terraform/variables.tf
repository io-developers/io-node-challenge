variable "region" {
  default = "us-west-2"
}

variable "access_key" {
  default = ""
}

variable "secret_access_key" {
  default = ""
}

variable "account_table_name" {
  default = "accounts"
}

variable "transaction_table_name" {
  default = "transactions"
}

variable "devops_role_arn" {
  description = "ARN of the existing IAM role for Lambda"
  type        = string
  default = "arn:aws:iam::772466482736:role/devops"
}