resource "aws_dynamodb_table" "accounts" {
  name         = "accounts"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "id"

  attribute {
    name = "id"
    type = "S"
  }

  tags = {
    Name = "accounts"
  }
}