resource "aws_cloudwatch_log_group" "log_group_for_sfn" {
  name              = "/aws/step_function/${var.step-function-name}"
  retention_in_days = 30
}