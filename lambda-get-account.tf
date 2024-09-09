# Crear la función Lambda para el handler
resource "aws_lambda_function" "get-account" {
  filename      = "get-account.zip"
  function_name = "get-account"
  role          = aws_iam_role.lambda_exec_get-account.arn
  handler       = "index.handler"
  runtime       = "nodejs20.x"
}
# Zippear el código de Node.js
data "archive_file" "zip_the_node_code_get-account" {
  type        = "zip"
  source_dir  = "dist/get-account"
  output_path = "get-account.zip"
}
# Crear el rol de ejecución de Lambda
resource "aws_iam_role" "lambda_exec_get-account" {
  name               = "lambda-exec-role_get-account"
  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": "sts:AssumeRole",
      "Principal": {
        "Service": "lambda.amazonaws.com"
      },
      "Effect": "Allow",
      "Sid": ""
    }
  ]
}
EOF
}
# Crear la política de permisos para DynamoDB
resource "aws_iam_policy" "dynamodb_read_policy_get-account" {
  name   = "dynamodb-read-policy_get-account"
  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "dynamodb:GetItem",
        "dynamodb:Query"
      ],
      "Resource": "${aws_dynamodb_table.accounts.arn}"
    }
  ]
}
EOF
}

# Adjuntar la política de ejecución de Lambda al rol
resource "aws_iam_role_policy_attachment" "lambda_basic_execution_get-account" {
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
  role       = aws_iam_role.lambda_exec_get-account.name
}
# Adjuntar la política de permisos al rol de ejecución de Lambda
resource "aws_iam_role_policy_attachment" "lambda_dynamodb_read_policy_attachment_get-account" {
  policy_arn = aws_iam_policy.dynamodb_read_policy_get-account.arn
  role       = aws_iam_role.lambda_exec_get-account.name
}

# Crear la política de invocación de la función Lambda desde el API Gateway
resource "aws_lambda_permission" "apigw_lambda_invoke_get-account" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.get-account.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_api_gateway_rest_api.my_api.execution_arn}/*"
}