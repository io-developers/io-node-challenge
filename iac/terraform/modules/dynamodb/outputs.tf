output "table_transactions_arn" {
  value = aws_dynamodb_table.transactions.arn
}

output "table_transactions_stream_arn" {
  value = aws_dynamodb_table.transactions.stream_arn
}

output "table_users_arn" {
  value = aws_dynamodb_table.users.arn
}

output "table_activity_arn" {
  value = aws_dynamodb_table.activity.arn
}
