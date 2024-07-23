
# Create and upload Lambda function archive

data "archive_file" "lambda_execute_payments" {
  type = "zip"

  source_dir  = "${path.module}/../../../../../microservices/dist/ms/execute_payments"
  output_path = "${path.module}/../../../../../microservices/dist/ms/execute_payments.zip"
}

resource "aws_s3_object" "lambda_execute_payments" {
  bucket = var.lambda_bucket_name

  key    = "execute_payments.zip"
  source = data.archive_file.lambda_execute_payments.output_path

  etag = filemd5(data.archive_file.lambda_execute_payments.output_path)
}

#END resource

# Create the Lambda function

resource "aws_lambda_function" "lambda_execute_payments" {
  function_name = "lambda_execute_payments"

  s3_bucket = var.lambda_bucket_name
  s3_key    = aws_s3_object.lambda_execute_payments.key

  runtime = "nodejs20.x"
  handler = "application/handlers/handler.handler"

  source_code_hash = data.archive_file.lambda_execute_payments.output_base64sha256

  role = aws_iam_role.lambda_execute_payments_exec.arn
  environment {
    variables = {
      API_MOCK_URL : "${var.api_gateway_url_api_mock}/mock-transaction"
    }
  }
}


resource "aws_cloudwatch_log_group" "lambda_execute_payments" {
  name = "/aws/lambda/${aws_lambda_function.lambda_execute_payments.function_name}"
  retention_in_days = 30
}

resource "aws_iam_role" "lambda_execute_payments_exec" {
  name = "serverless_lambda_payment"

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

resource "aws_iam_role_policy_attachment" "lambda_execute_payments_exec" {
  role       = aws_iam_role.lambda_execute_payments_exec.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

