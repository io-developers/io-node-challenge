resource "aws_dynamodb_table" "users" {
  name         = "users"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "userId"

  attribute {
    name = "userId"
    type = "S"
  }

  tags = {
    Name = "users"
  }
}

resource "aws_dynamodb_table_item" "seed1" {
  table_name = aws_dynamodb_table.users.name
  hash_key   = aws_dynamodb_table.users.hash_key

  item = <<ITEM
  {
    "userId": {"S": "f529177d-0521-414e-acd9-6ac840549e97"},
    "name": {"S": "Pedro"},
    "lastName": {"S": "Suarez"}
  }
ITEM
}

resource "aws_dynamodb_table_item" "seed2" {
  table_name = aws_dynamodb_table.users.name
  hash_key   = aws_dynamodb_table.users.hash_key

  item = <<ITEM
  {
    "userId": {"S": "15f1c60a-2833-49b7-8660-065b58be2f89"},
    "name": {"S": "Andrea"},
    "lastName": {"S": "Vargas"}
  }
  ITEM
}