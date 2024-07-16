terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}
provider "aws" {
  region = var.region
}

module "zip_resources" {
  source = "./zipfile"
}

module "dynamodb_resources" {
  source = "./dynamodb"
}

module "lambda_resources" {
  source                             = "./lambda"
  zip_activity_lambda_output_path    = module.zip_resources.zip_activity_lambda_output_path
  zip_mocks_lambda_output_path       = module.zip_resources.zip_mocks_lambda_output_path
  zip_payments_lambda_output_path    = module.zip_resources.zip_payments_lambda_output_path
  zip_transaction_lambda_output_path = module.zip_resources.zip_transaction_lambda_output_path

  zip_activity_lambda_output_base64    = module.zip_resources.zip_activity_lambda_output_base64
  zip_mocks_lambda_output_base64       = module.zip_resources.zip_mocks_lambda_output_base64
  zip_payments_lambda_output_base64    = module.zip_resources.zip_payments_lambda_output_base64
  zip_transaction_lambda_output_base64 = module.zip_resources.zip_transaction_lambda_output_base64

  transactions_table_name = module.dynamodb_resources.transactions_table_name
  activity_table_name     = module.dynamodb_resources.activity_table_name
  users_table_name        = module.dynamodb_resources.users_table_name

  aws_region      = var.region
  api_gateway_url = module.apigateway_resources.api_gateway_url
  transactions_table_stream_arn = module.dynamodb_resources.transactions_table_stream_arn
}

module "step-function-process-payments" {
  source                  = "./stepFunction"
  lambda-payments-arn     = module.lambda_resources.lambda_payments_arn
  table-name-transactions = module.dynamodb_resources.transactions_table_name
  table-name-users        = module.dynamodb_resources.users_table_name
}

module "apigateway_resources" {
  source = "./apigateway"

  step_function_invoke_arn      = module.step-function-process-payments.state_machine_arn
  lambda_mocks_invoke_arn       = module.lambda_resources.lambda_mocks_arn_invoke
  lambda_transaction_invoke_arn = module.lambda_resources.lambda_transaction_arn_invoke

  lambda_mocks_function_name       = module.lambda_resources.lambda_mocks_function_name
  lambda_transaction_function_name = module.lambda_resources.lambda_transaction_function_name

  proyect_name = var.proyect_name
}
