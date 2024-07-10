

resource "aws_dynamodb_table" "users" {
  name           = "io-node-challenge-user"
  billing_mode   = "PAY_PER_REQUEST"
  hash_key       = "userId"

  attribute {
    name = "userId"
    type = "S"
  }

  tags = {
    Name = "io-node-challenge-user"
  }

}
