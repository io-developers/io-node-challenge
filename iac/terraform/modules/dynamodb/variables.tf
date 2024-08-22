variable "users_table" {
  description = "The users table must contain data on the users who can carry out a transaction."
  type        = string
  default     = "users"
}

variable "transactions_table" {
  description = "saves the information of each successful transaction made"
  type        = string
  default     = "transactions"
}

variable "activity_table" {
  description = "saves the record of each interaction with the transactions table"
  type        = string
  default     = "activity"
}
