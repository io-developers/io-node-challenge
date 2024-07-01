

resource "aws_dynamodb_table" "users" {
  name           = "users"
  billing_mode   = "PAY_PER_REQUEST"
  hash_key       = "userId"

  attribute {
    name = "userId"
    type = "S"
  }

  attribute {
    name = "name"
    type = "S"
  }

  attribute {
    name = "lastName"
    type = "S"
  }

  global_secondary_index {
    name               = "name-index"
    hash_key           = "name"
    projection_type    = "ALL"
  }

  global_secondary_index {
    name               = "lastName-index"
    hash_key           = "lastName"
    projection_type    = "ALL"
  }

  tags = {
    Name = "users"
  }

}

output "table_users_arn" {
  value = aws_dynamodb_table.transactions.arn
}