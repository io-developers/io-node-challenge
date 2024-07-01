provider "aws" {
    region="us-east-2"
}

module "dynamodb_resources" {
  source = "./db"
}


module "lambda_resources" {
  source = "./lambda"
}

module "step_functions_resources" {
  source = "./step_functions"
}


module "gateway_resources" {
  source = "./gateway"
}


