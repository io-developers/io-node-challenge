terraform {
  required_version = ">= 1.8.5"
  backend "s3" {
    region  = "us-east-1"
    profile = "default"
    bucket  = "terraform-backend40240802370429644055320041"
    key     = "services/tf-workspace-ex/default.tfstate"
  }
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "5.59.0"
    }
  }
}