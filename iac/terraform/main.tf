locals {
  table_transactions = "transactions"
  table_activity     = "activity"
  table_users        = "users"
}

#Configuración de DynamoDB
module "bucket_resource" {
  source = "./modules/bucket"
}

#Configuración de DynamoDB
module "dynamodb_resources" {
  source = "./modules/dynamodb"

  activity_table     = local.table_activity
  transactions_table = local.table_transactions
  users_table        = "users"
}

module "lambda_get_transactions_resources" {
  source = "./modules/lambda/get-transactions"

  table_name_transactions = local.table_transactions
  lambda_bucket_name      = module.bucket_resource.lambda_bucket_name
}

module "lambda_register_activity_resources" {
  source = "./modules/lambda/register-activity"

  table_name_activity           = local.table_activity
  lambda_bucket_name            = module.bucket_resource.lambda_bucket_name
  table_transactions_stream_arn = module.dynamodb_resources.table_transactions_stream_arn
}

module "lambda_api_mock_resources" {
  source             = "./modules/lambda/api-mock"
  lambda_bucket_name = module.bucket_resource.lambda_bucket_name
}

module "lambda_execute_payment_resources" {
  source                   = "./modules/lambda/execute-payments"
  lambda_bucket_name       = module.bucket_resource.lambda_bucket_name
  api_gateway_url_api_mock = module.api_gateway_resources.base_url
}

module "api_gateway_resources" {
  source                               = "./modules/api_gateway"
  lambda_get_transaction_invoke_arn    = module.lambda_get_transactions_resources.invoke_arn
  lambda_get_transaction_function_name = module.lambda_get_transactions_resources.function_name
  lambda_api_mock_invoke_arn           = module.lambda_api_mock_resources.invoke_arn
  lambda_api_mock_function_name        = module.lambda_api_mock_resources.function_name
  lambda_execute_payment_invoke_arn    = module.lambda_execute_payment_resources.invoke_arn
  lambda_execute_payment_function_name = module.lambda_execute_payment_resources.function_name
  step_function_invoke_arn             = module.step_function_resources.invoke_arn
}

module "step_function_resources" {
  source                   = "./modules/step_function"
  users_table              = local.table_users
  transactions_table       = local.table_transactions
  lambda_execution_payment = module.lambda_execute_payment_resources.invoke_arn

  table_users_arn                   = module.dynamodb_resources.table_users_arn
  table_transactions_arn            = module.dynamodb_resources.table_transactions_arn
  lambda_execute_payment_invoke_arn = module.lambda_execute_payment_resources.invoke_arn
}
