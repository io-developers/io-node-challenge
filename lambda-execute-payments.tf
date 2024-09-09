# Crear la función Lambda para el handler
resource "aws_lambda_function" "execute-payments" {
  filename      = "execute-payments.zip"
  function_name = "execute-payments"
  role          = aws_iam_role.lambda_exec_execute-payments.arn
  handler       = "index.handler"
  runtime       = "nodejs20.x"
}
# Zippear el código de Node.js
data "archive_file" "zip_the_node_code_execute-payments" {
  type        = "zip"
  source_dir  = "dist/execute-payments"
  output_path = "execute-payments.zip"
}
# Crear el rol de ejecución de Lambda
resource "aws_iam_role" "lambda_exec_execute-payments" {
  name               = "lambda-exec-role_execute-payments"
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
resource "aws_iam_policy" "dynamodb_crud_policy_execute-payments" {
  name   = "dynamodb-crud-policy_execute-payments"
  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "dynamodb:GetItem",
        "dynamodb:Query",
        "dynamodb:PutItem",
        "dynamodb:UpdateItem",
        "dynamodb:DeleteItem",
        "dynamodb:Scan"
      ],
      "Resource": "${aws_dynamodb_table.transactions.arn}"
    }
  ]
}
EOF
}

# Adjuntar la política de ejecución de Lambda al rol
resource "aws_iam_role_policy_attachment" "lambda_basic_execution_execute-payments" {
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
  role       = aws_iam_role.lambda_exec_execute-payments.name
}
# Adjuntar la política de permisos al rol de ejecución de Lambda
resource "aws_iam_role_policy_attachment" "lambda_dynamodb_read_policy_attachment_execute-payments" {
  policy_arn = aws_iam_policy.dynamodb_crud_policy_execute-payments.arn
  role       = aws_iam_role.lambda_exec_execute-payments.name
}