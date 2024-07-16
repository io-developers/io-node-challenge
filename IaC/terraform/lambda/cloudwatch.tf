# resource "aws_cloudwatch_log_group" "cloudwatch_lambda" {
#   name = "/aws/lambda/${aws_lambda_function.hello_world.function_name}"
#   retention_in_days = 30
# }