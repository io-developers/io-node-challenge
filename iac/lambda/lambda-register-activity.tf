resource "aws_lambda_function" "lambda-register-activity" {
  function_name = "lambda-register-activity"
  filename      = "${path.module}/lambda-register-activity.zip"
  handler       = "dist/src/index.handler"
  runtime       = "nodejs20.x"

  role = aws_iam_role.lambda_execution_role.arn

  source_code_hash = filebase64sha256("${path.module}/lambda-register-activity.zip")

  environment {
    variables = {
      # Define aquí las variables de entorno si necesitas
    }
  }
}

/*
resource "aws_lambda_event_source_mapping" "dynamodb_stream" {
  event_source_arn = aws_dynamodb_table.activity.stream_arn
  function_name    = aws_lambda_function.lambda-register-activity.arn
  starting_position = "LATEST"
}*/

resource "aws_iam_role" "lambda_execution_role2" {
  name = "lambda_execution_role2"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "lambda.amazonaws.com"
        }
      },
    ]
  })
}

resource "aws_iam_role_policy" "lambda_execution_policy2" {
  name   = "lambda_execution_policy2"
  role   = aws_iam_role.lambda_execution_role2.id
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = [
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:PutLogEvents",
        ]
        Effect   = "Allow"
        Resource = "arn:aws:logs:*:*:*"
      },
      {
        Action = [
          "dynamodb:GetItem",
          "dynamodb:PutItem",
          "dynamodb:UpdateItem",
          "dynamodb:Scan",
          "dynamodb:Query",
          "dynamodb:DescribeTable",
          "dynamodb:StreamRecord",
          "dynamodb:ListStreams",
          "dynamodb:GetRecords",
          "dynamodb:GetShardIterator",
          "dynamodb:DescribeStream"
          
        ]
        Effect   = "Allow"
        Resource = "*"
      },
      {
        Action = [
          "lambda:ListLayers",
          "lambda:GetLayerVersion"
        ]
        Effect   = "Allow"
        Resource = "*"
      }
    ]
  })
}