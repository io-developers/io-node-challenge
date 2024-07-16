resource "aws_lambda_function" "payments" {
  function_name    = var.payments_lambda_name
  role             = aws_iam_role.lambda_execution_role.arn
  handler          = "main.handler"
  runtime          = "nodejs20.x"
  filename         = var.zip_payments_lambda_output_path
  source_code_hash = var.zip_payments_lambda_output_base64
  environment {
    variables = {
      HTTP_API_MOCK = "${var.api_gateway_url}/v1/mock-payments"
    }
  }
}
