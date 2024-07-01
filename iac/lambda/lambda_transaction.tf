
resource "aws_lambda_function" "lambda-transactions" {
  function_name = "lambda-transactions"
  filename      = "${path.module}/lambda-transactions.zip"
  handler       = "dist/src/index.handler"
  runtime       = "nodejs20.x"

  role = aws_iam_role.lambda_execution_role.arn

 /* vpc_config {
    subnet_ids         = [var.public_subnet_1_id, var.public_subnet_2_id]
    security_group_ids = [var.lambda_sg_id]
  }*/
  source_code_hash = filebase64sha256("${path.module}/lambda-transactions.zip")

  environment {
    variables = {
      # Define aquí las variables de entorno si necesitas
    }
  }
}

output "lambda_arn_transaction" {
  value = aws_lambda_function.lambda-transactions.arn
  description = "The ARN of the Lambda function"
}