variable "lambda_bucket_name" {
  description = "Name of the S3 bucket used to store function code."
  type        = string
}

variable "api_gateway_url_api_mock"{
    description = "URL of the api-mock API Gateway"
    type        = string
}
