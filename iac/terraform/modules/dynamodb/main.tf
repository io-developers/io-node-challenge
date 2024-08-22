resource "aws_dynamodb_table" "users" {
  name         = var.users_table
  hash_key     = "userId"
  billing_mode = "PAY_PER_REQUEST"

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
    name            = "name-lastName-index"
    hash_key        = "name"
    range_key       = "lastName"
    projection_type = "ALL"
  }

  tags = {
    Name        = "bcp-challenge-users"
    Environment = "develop"
  }
}
# Items required user data
resource "aws_dynamodb_table_item" "user_pedro" {
  table_name = aws_dynamodb_table.users.name
  hash_key   = "userId"

  item = <<ITEM
        {
          "userId": {"S": "f529177d-0521-414e-acd9-6ac840549e97"},
          "name": {"S": "Pedro"},
          "lastName": {"S": "Suarez"}
        }
        ITEM
}

resource "aws_dynamodb_table_item" "user_andrea" {
  table_name = aws_dynamodb_table.users.name
  hash_key   = "userId"

  item = <<ITEM
          {
            "userId": {"S": "15f1c60a-2833-49b7-8660-065b58be2f89"},
            "name": {"S": "Andrea"},
            "lastName": {"S": "Vargas"}
          }
          ITEM
}
# END Items required user data

resource "aws_dynamodb_table" "transactions" {
  name         = var.transactions_table
  hash_key     = "transactionId"
  billing_mode = "PAY_PER_REQUEST"

  attribute {
    name = "transactionId"
    type = "S"
  }
  attribute {
    name = "userId"
    type = "S"
  }

  stream_enabled   = true
  stream_view_type = "NEW_IMAGE"

  global_secondary_index {
    name            = "userId-index"
    hash_key        = "userId"
    projection_type = "ALL"
  }

  tags = {
    Name        = "bcp-challenge-transactions"
    Environment = "develop"
  }
}

resource "aws_dynamodb_table" "activity" {
  name         = var.activity_table
  hash_key     = "activityId"
  billing_mode = "PAY_PER_REQUEST" //facilitates automatic scaling

  attribute {
    name = "activityId"
    type = "S"
  }
  attribute {
    name = "transactionId"
    type = "S"
  }
  attribute {
    name = "date"
    type = "S"
  }

  global_secondary_index {
    name            = "transactionId-index"
    hash_key        = "transactionId"
    projection_type = "ALL"
  }

  global_secondary_index {
    name            = "date-index"
    hash_key        = "date"
    projection_type = "ALL"
  }

  tags = {
    Name        = "bcp-challenge-activity"
    Environment = "develop"
  }
}
