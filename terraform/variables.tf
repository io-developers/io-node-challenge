variable "region" {
  default = "us-west-2" #Colocar la región de AWS que usarás
}

variable "access_key" {
  default = ""  #Colocar tu Access Key de AWS
}

variable "secret_access_key" {
  default = ""  #Colocar tu Secret Key de AWS
}

variable "account_table_name" {
  default = "accounts" #Nombre de la tabla dynamoDB para cuentas de usuario
}

variable "transaction_table_name" {
  default = "transactions" #Nombre de la tabla dynamoDB para transacciones
}

variable "devops_role_arn" {
  description = "ARN of the existing IAM role for Lambda"
  type        = string
  default = "arn:aws:iam::772466482736:role/devops" #ARN del rol que usarás para utilizar los servicios AWS
}