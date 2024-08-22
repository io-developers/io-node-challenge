# Definir las variables
TERRAFORM_DIR = ./iac/terraform
TERRAFORM = terraform
AWS_CLI = aws
LOAD_SCRIPT = ./iac/terraform/modules/dynamodb/load_data.sh

all: build init apply

build:
	@echo "build projects..."
	cd ./microservices && npm run deploy

init:
	@echo "Initializing Terraform..."
	cd $(TERRAFORM_DIR) && $(TERRAFORM) init

apply:
	@echo "Applying Terraform configuration..."
	cd $(TERRAFORM_DIR) && $(TERRAFORM) apply -auto-approve

clean:
	@echo "Destroying Terraform-managed infrastructure..."
	cd $(TERRAFORM_DIR) && $(TERRAFORM) destroy -auto-approve
