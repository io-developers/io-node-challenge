
# Create and upload Lambda function archive

data "archive_file" "lambda_api_mock" {
  type = "zip"

  source_dir  = "${path.module}/../../../../../microservices/dist/ms/api_mock"
  output_path = "${path.module}/../../../../../microservices/dist/ms/api_mock.zip"
}

resource "aws_s3_object" "lambda_api_mock" {
  bucket = var.lambda_bucket_name

  key    = "api_mock.zip"
  source = data.archive_file.lambda_api_mock.output_path

  etag = filemd5(data.archive_file.lambda_api_mock.output_path)
}

#END resource

# Create the Lambda function

resource "aws_lambda_function" "lambda_api_mock" {
  function_name = "lambda_api_mock"
  s3_bucket = var.lambda_bucket_name
  s3_key    = aws_s3_object.lambda_api_mock.key
  runtime = "nodejs20.x"
  handler = "application/controllers/transactionMock.executePayment"
  source_code_hash = data.archive_file.lambda_api_mock.output_base64sha256
  role = aws_iam_role.lambda_api_mock_exec.arn
}

resource "aws_cloudwatch_log_group" "lambda_api_mock" {
  name = "/aws/lambda/${aws_lambda_function.lambda_api_mock.function_name}"
  retention_in_days = 30
}

resource "aws_iam_role" "lambda_api_mock_exec" {
  name = "serverless_lambda_mock_api"

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

resource "aws_iam_role_policy_attachment" "lambda_api_mock_policy" {
  role       = aws_iam_role.lambda_api_mock_exec.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

