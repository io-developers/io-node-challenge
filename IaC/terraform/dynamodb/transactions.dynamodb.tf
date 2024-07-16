resource "aws_dynamodb_table" "transactions" {
  name         = "transactions"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "transactionId"

  attribute {
    name = "transactionId"
    type = "S"
  }

  stream_enabled = true

  stream_view_type = "NEW_IMAGE"

  tags = {
    Name = "transactions"
  }
}