resource "aws_cloudwatch_log_group" "api_gw" {
  name = "/aws/api_gw/${var.proyect_name}"

  retention_in_days = 30
}