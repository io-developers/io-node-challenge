output "transactions_table_name" {
  value = aws_dynamodb_table.transactions.name
}
output "activity_table_name" {
  value = aws_dynamodb_table.activity.name
}
output "users_table_name" {
  value = aws_dynamodb_table.users.name
}


output "transactions_table_stream_arn" {
  value = aws_dynamodb_table.transactions.stream_arn
}