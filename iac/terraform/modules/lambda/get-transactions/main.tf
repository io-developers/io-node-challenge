
# Create and upload Lambda function archive

data "archive_file" "lambda_get_transactions" {
  type = "zip"

  source_dir  = "${path.module}/../../../../../microservices/dist/ms/get_transactions"
  output_path = "${path.module}/../../../../../microservices/dist/ms/get_transactions.zip"

}

resource "aws_s3_object" "lambda_get_transactions" {
  bucket = var.lambda_bucket_name

  key    = "get_transactions.zip"
  source = data.archive_file.lambda_get_transactions.output_path

  etag = filemd5(data.archive_file.lambda_get_transactions.output_path)
}

#END resource

# Create the Lambda function

resource "aws_lambda_function" "lambda_get_transactions" {
  function_name = "lambda_get_transactions"

  s3_bucket = var.lambda_bucket_name
  s3_key    = aws_s3_object.lambda_get_transactions.key

  runtime = "nodejs20.x"
  handler = "application/handlers/handler.handler"

  source_code_hash = data.archive_file.lambda_get_transactions.output_base64sha256

  role = aws_iam_role.lambda_exec.arn
  environment {
    variables = {
      TRANSACTIONS_TABLE : var.table_name_transactions
    }
  }
}

resource "aws_cloudwatch_log_group" "lambda_get_transactions" {
  name = "/aws/lambda/${aws_lambda_function.lambda_get_transactions.function_name}"

  retention_in_days = 30
}

resource "aws_iam_role" "lambda_exec" {
  name = "serverless_lambda"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action = "sts:AssumeRole"
      Effect = "Allow"
      Sid    = ""
      Principal = {
        Service = "lambda.amazonaws.com"
      }
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "lambda_policy" {
  role       = aws_iam_role.lambda_exec.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

resource "aws_iam_role_policy_attachment" "dynamo_full_access_attachment" {
  role       = aws_iam_role.lambda_exec.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonDynamoDBFullAccess"
}
