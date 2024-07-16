resource "aws_lambda_function" "mocks" {
  function_name    = var.mocks_lambda_name
  role             = aws_iam_role.lambda_execution_role.arn
  handler          = "main.handler"
  runtime          = "nodejs20.x"
  filename         = var.zip_mocks_lambda_output_path
  source_code_hash = var.zip_mocks_lambda_output_base64
  environment {
    variables = {
    }
  }
}
