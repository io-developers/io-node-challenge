

resource "aws_dynamodb_table" "transactions" {
  name           = "transactions"
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

  stream_enabled = true

  stream_view_type = "NEW_IMAGE"

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
    Name = "transactions"
  }
}


output "table_transactions_arn" {
  value = aws_dynamodb_table.transactions.arn
}