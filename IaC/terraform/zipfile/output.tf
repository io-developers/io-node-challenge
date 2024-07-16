output "zip_activity_lambda_output_path" {
  value = data.archive_file.zip_activity_lambda.output_path
}

output "zip_mocks_lambda_output_path" {
  value = data.archive_file.zip_mocks_lambda.output_path
}

output "zip_payments_lambda_output_path" {
  value = data.archive_file.zip_payments_lambda.output_path
}

output "zip_transaction_lambda_output_path" {
  value = data.archive_file.zip_transaction_lambda.output_path
}



output "zip_activity_lambda_output_base64" {
  value = data.archive_file.zip_activity_lambda.output_base64sha256
}

output "zip_mocks_lambda_output_base64" {
  value = data.archive_file.zip_mocks_lambda.output_base64sha256
}

output "zip_payments_lambda_output_base64" {
  value = data.archive_file.zip_payments_lambda.output_base64sha256
}

output "zip_transaction_lambda_output_base64" {
  value = data.archive_file.zip_transaction_lambda.output_base64sha256
}