data "archive_file" "zip_activity_lambda" {
  type        = "zip"
  source_dir  = "${path.module}/../../../dist/apps/activity"
  output_path = "${path.module}/../../../dist/apps/activity.zip"
}
data "archive_file" "zip_mocks_lambda" {
  type        = "zip"
  source_dir  = "${path.module}/../../../dist/apps/mocks"
  output_path = "${path.module}/../../../dist/apps/mocks.zip"
}
data "archive_file" "zip_payments_lambda" {
  type        = "zip"
  source_dir  = "${path.module}/../../../dist/apps/payments"
  output_path = "${path.module}/../../../dist/apps/payments.zip"
}
data "archive_file" "zip_transaction_lambda" {
  type        = "zip"
  source_dir  = "${path.module}/../../../dist/apps/transaction"
  output_path = "${path.module}/../../../dist/apps/transaction.zip"
}