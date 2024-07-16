
resource "aws_dynamodb_table" "activity" {
  name         = "activity"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "activityId"

  attribute {
    name = "activityId"
    type = "S"
  }

  tags = {
    Name = "activity"
  }
}