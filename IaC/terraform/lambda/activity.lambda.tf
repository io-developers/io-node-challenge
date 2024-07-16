resource "aws_lambda_function" "activity" {
  function_name    = var.activity_lambda_name
  role             = aws_iam_role.lambda_execution_role.arn
  handler          = "main.handler"
  runtime          = "nodejs20.x"
  filename         = var.zip_activity_lambda_output_path
  source_code_hash = var.zip_activity_lambda_output_base64

  environment {
    variables = {
      TABLE_ACTIVITY : var.activity_table_name
    }
  }
}

resource "aws_lambda_event_source_mapping" "dynamodb_mapping" {
  event_source_arn  = var.transactions_table_stream_arn
  function_name     = aws_lambda_function.activity.function_name
  batch_size        = 100
  starting_position = "LATEST"
}