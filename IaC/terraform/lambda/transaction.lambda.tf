resource "aws_lambda_function" "transaction" {
  function_name    = var.transaction_lambda_name
  role             = aws_iam_role.lambda_execution_role.arn
  handler          = "main.handler"
  runtime          = "nodejs20.x"
  filename         = var.zip_transaction_lambda_output_path
  source_code_hash = var.zip_transaction_lambda_output_base64
  environment {
    variables = {
      TABLE_TRANSACTION : var.transactions_table_name
    }
  }
}
