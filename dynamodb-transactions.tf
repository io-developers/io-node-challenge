# DynamoDB table for transactions enabled with dynamodb streams new and old images
resource "aws_dynamodb_table" "transactions" {
  name             = "transactions"
  billing_mode     = "PAY_PER_REQUEST"
  stream_enabled   = true
  stream_view_type = "NEW_AND_OLD_IMAGES"
  hash_key         = "source"
  range_key        = "id"

  attribute {
    name = "source"
    type = "S"
  }

  attribute {
    name = "id"
    type = "S"
  }

  tags = {
    Name = "transactions"
  }
}