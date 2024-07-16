resource "aws_iam_role" "step_function_role" {
  name = "step_function_role"
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "states.amazonaws.com"
        }
      },
    ]
  })

}

resource "aws_iam_policy" "step_functions_policy" {
  name        = "step-functions-policy"
  description = "Policy for Step Functions state machine"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow",
        Action = [
          "states:StartSyncExecution",
          "states:DescribeExecution",
          "states:GetExecutionHistory"
        ],
        Resource = "*"
      },
      {
        Effect : "Allow",
        Action : "dynamodb:GetItem",
        Resource : "arn:aws:dynamodb:us-east-2:767397871164:table/users"
      },
      {
        Effect : "Allow",
        Action : "dynamodb:PutItem",
        Resource : "arn:aws:dynamodb:us-east-2:767397871164:table/transactions"
      },
      {
        Effect : "Allow",
        Action : [
          "lambda:InvokeAsync",
          "lambda:InvokeFunction"
        ],
        Resource : "arn:aws:lambda:us-east-2:767397871164:function:execute-payments"
      }
    ]
  })
}
resource "aws_iam_role_policy_attachment" "step_functions_policy_attachment" {
  role       = aws_iam_role.step_function_role.name
  policy_arn = aws_iam_policy.step_functions_policy.arn
}



# resource "aws_iam_policy" "cloudwatch_logs_policy" {
#   name        = "cloudwatch-logs-policy"
#   description = "Policy for writing CloudWatch Logs from Step Functions"
#   policy = jsonencode({
#     Version = "2012-10-17"
#     Statement = [
#       {
#         Effect   = "Allow",
#         Action   = [
#           "logs:CreateLogGroup",
#           "logs:CreateLogStream",
#           "logs:PutLogEvents"
#         ],
#         Resource = [
#           aws_cloudwatch_log_group.log_group_for_sfn.arn,
#           "${aws_cloudwatch_log_group.log_group_for_sfn.arn}:*"
#         ]
#       }
#     ]
#   })
# }

# resource "aws_iam_role_policy_attachment" "cloudwatch_logs_policy_attachment" {
#   role       = aws_iam_role.step_function_role.name
#   policy_arn = aws_iam_policy.cloudwatch_logs_policy.arn
# }

resource "aws_iam_role_policy_attachment" "cloudwatch_full_access_attachment" {
  role       = aws_iam_role.step_function_role.name
  policy_arn = "arn:aws:iam::aws:policy/CloudWatchLogsFullAccess"
}