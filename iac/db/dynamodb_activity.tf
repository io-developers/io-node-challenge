
resource "aws_dynamodb_table" "activity" {
  name           = "activity"
  billing_mode   = "PAY_PER_REQUEST"
  hash_key       = "transactionId"

  attribute {
    name = "transactionId"
    type = "S"
  }

  attribute {
    name = "userId"
    type = "S"
  }

  attribute {
    name = "paymentAmount"
    type = "S"
  }

  global_secondary_index {
    name               = "userId-index"
    hash_key           = "userId"
    projection_type    = "ALL"
  }

  global_secondary_index {
    name               = "paymentAmount-index"
    hash_key           = "paymentAmount"
    projection_type    = "ALL"
  }

  tags = {
    Name = "activity"
  }
}

output "table_activity_arn" {
  value = aws_dynamodb_table.transactions.arn
}