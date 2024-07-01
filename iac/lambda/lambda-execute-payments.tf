resource "aws_lambda_function" "lambda-execute-payments" {
  function_name = "lambda-execute-payments"
  filename      = "${path.module}/lambda-execute-payments.zip"
  handler       = "dist/src/index.handler"
  runtime       = "nodejs20.x"

  role = aws_iam_role.lambda_execution_role.arn

  source_code_hash = filebase64sha256("${path.module}/lambda-execute-payments.zip")

  environment {
    variables = {
      # Define aquí las variables de entorno si necesitas
    }
  }
}

resource "aws_iam_role" "lambda_execution_role" {
  name = "lambda_execution_role"

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

resource "aws_iam_role_policy" "lambda_execution_policy" {
  name   = "lambda_execution_policy"
  role   = aws_iam_role.lambda_execution_role.id
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