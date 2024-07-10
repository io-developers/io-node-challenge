terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
    region="us-east-2"
}

module "dynamodb_resources" {
  source = "./db"
}

module "application" {
  source = "./application"
}




