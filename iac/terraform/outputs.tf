
output "api_gateway_resources_base_url" {
  value = module.api_gateway_resources.base_url
}

output "api_gateway_arn" {
  value = module.api_gateway_resources.invoke_arn
}

output "step_function_invoke_arn" {
  value = module.step_function_resources.invoke_arn
}

output "lambda_execute_payment_invoke_arn" {
  value = module.lambda_execute_payment_resources.invoke_arn
}

output "table_users_arn" {
  value = module.dynamodb_resources.table_users_arn
}

output "table_transactions_arn" {
  value = module.dynamodb_resources.table_transactions_arn
}

output "table_activity_arn" {
  value = module.dynamodb_resources.table_activity_arn
}


