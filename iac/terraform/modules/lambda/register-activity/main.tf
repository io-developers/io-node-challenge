
# Create and upload Lambda function archive

data "archive_file" "lambda_register_activity" {
  type = "zip"

  source_dir  = "${path.module}/../../../../../microservices/dist/ms/register_activity"
  output_path = "${path.module}/../../../../../microservices/dist/ms/register_activity.zip"
}

resource "aws_s3_object" "lambda_register_activity" {
  bucket = var.lambda_bucket_name

  key    = "register_activity.zip"
  source = data.archive_file.lambda_register_activity.output_path

  etag = filemd5(data.archive_file.lambda_register_activity.output_path)
}

#END resource

# Create the Lambda function

resource "aws_lambda_function" "lambda_register_activity" {
  function_name = "lambda_register_activity"

  s3_bucket = var.lambda_bucket_name
  s3_key    = aws_s3_object.lambda_register_activity.key

  runtime = "nodejs20.x"
  handler = "application/handlers/handler.handler"

  source_code_hash = data.archive_file.lambda_register_activity.output_base64sha256

  role = aws_iam_role.lambda_activity_exec.arn
  environment {
    variables = {
      ACTIVITY_TABLE : var.table_name_activity
    }
  }
}

resource "aws_lambda_event_source_mapping" "transaction_stream_mapping" {
  event_source_arn  = var.table_transactions_stream_arn
  function_name     = aws_lambda_function.lambda_register_activity.function_name
  starting_position = "LATEST"
}


resource "aws_cloudwatch_log_group" "lambda_register_activity" {
  name = "/aws/lambda/${aws_lambda_function.lambda_register_activity.function_name}"

  retention_in_days = 30
}

resource "aws_iam_role" "lambda_activity_exec" {
  name = "serverless_lambda_activity"

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

resource "aws_iam_role_policy_attachment" "lambda_activity_policy" {
  role       = aws_iam_role.lambda_activity_exec.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

resource "aws_iam_role_policy_attachment" "dynamo_full_access_attachment" {
  role       = aws_iam_role.lambda_activity_exec.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonDynamoDBFullAccess"
}
