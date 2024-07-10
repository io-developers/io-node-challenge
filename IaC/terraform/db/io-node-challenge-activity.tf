
resource "aws_dynamodb_table" "activity" {
  name           = "io-node-challenge-activity"
  billing_mode   = "PAY_PER_REQUEST"
  hash_key       = "activityId"

  attribute {
    name = "activityId"
    type = "S"
  }

  tags = {
    Name = "io-node-challenge-activity"
  }
}