# Create an integration between the API Gateway and the Lambda Get-Transaction
resource "aws_apigatewayv2_integration" "execute_payment" {
  api_id              = aws_apigatewayv2_api.api_bcp_challenged.id
  integration_type    = "AWS_PROXY"
  integration_subtype = "StepFunctions-StartSyncExecution"
  credentials_arn     = aws_iam_role.api_gateway_role.arn
  request_parameters = {
    "StateMachineArn" = var.step_function_invoke_arn
    "Input" : "$request.body"
  }
}

resource "aws_apigatewayv2_route" "execute_payment" {
  api_id = aws_apigatewayv2_api.api_bcp_challenged.id

  route_key = "POST /v1/payments"
  target    = "integrations/${aws_apigatewayv2_integration.execute_payment.id}"
}
#END

resource "aws_iam_role" "api_gateway_role" {
  name = "api_gateway_role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Action = "sts:AssumeRole",
        Effect = "Allow",
        Principal = {
          Service = "apigateway.amazonaws.com"
        }
      }
    ]
  })
  inline_policy {
    name = "allowStepFunction"
    policy = jsonencode({
      Version = "2012-10-17"
      Statement = [
        {
          Effect   = "Allow"
          Action   = "states:StartSyncExecution"
          Resource = "*"
        }
      ]
    })
  }
}
