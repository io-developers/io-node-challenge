# Crear la función Lambda para el handler
resource "aws_lambda_function" "update-account" {
  filename      = "update-account.zip"
  function_name = "update-account"
  role          = aws_iam_role.lambda_exec_update-account.arn
  handler       = "index.handler"
  runtime       = "nodejs20.x"
}
# Zippear el código de Node.js
data "archive_file" "zip_the_node_code_update-account" {
  type        = "zip"
  source_dir  = "dist/update-account"
  output_path = "update-account.zip"
}
# Crear el rol de ejecución de Lambda
resource "aws_iam_role" "lambda_exec_update-account" {
  name               = "lambda-exec-role_update-account"
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
resource "aws_iam_policy" "dynamodb_crud_policy_update-account" {
  name   = "dynamodb-crud-policy_update-account"
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
      "Resource": "${aws_dynamodb_table.accounts.arn}"
    }
  ]
}
EOF
}
# Crear la política de permisos para DynamoDB
resource "aws_iam_policy" "dynamodb_stream_policy_update-account" {
  name   = "dynamodb-stream-policy_update-account"
  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "dynamodb:BatchGetItem",
         "dynamodb:GetItem",
         "dynamodb:GetRecords",
         "dynamodb:Scan",
         "dynamodb:Query",
         "dynamodb:GetShardIterator",
         "dynamodb:DescribeStream",
         "dynamodb:ListStreams"
      ],
        "Resource": [
          "${aws_dynamodb_table.transactions.arn}",
          "${aws_dynamodb_table.transactions.arn}/*"
        ]
    }
  ]
}
EOF
}

# Adjuntar la política de ejecución de Lambda al rol
resource "aws_iam_role_policy_attachment" "lambda_basic_execution_update-account" {
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
  role       = aws_iam_role.lambda_exec_update-account.name
}
# Adjuntar la política de permisos al rol de ejecución de Lambda
resource "aws_iam_role_policy_attachment" "lambda_dynamodb_crud_policy_attachment_update-account" {
  policy_arn = aws_iam_policy.dynamodb_crud_policy_update-account.arn
  role       = aws_iam_role.lambda_exec_update-account.name
}
# Adjuntar la política de permisos al rol de ejecución de Lambda
resource "aws_iam_role_policy_attachment" "lambda_dynamodb_read_policy_attachment_update-account" {
  policy_arn = aws_iam_policy.dynamodb_stream_policy_update-account.arn
  role       = aws_iam_role.lambda_exec_update-account.name
}

# Lambda event source mapping DynamoDB stream
resource "aws_lambda_event_source_mapping" "example" {
  event_source_arn  = aws_dynamodb_table.transactions.stream_arn
  function_name     = aws_lambda_function.update-account.arn
  starting_position = "LATEST"
}