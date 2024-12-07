# Configurar el trigger de DynamoDB en la función Lambda
resource "aws_lambda_event_source_mapping" "transactions_dynamodb_trigger" {
  event_source_arn = "arn:aws:dynamodb:us-west-2:772466482736:table/transactions/stream/2024-09-03T07:17:57.952"  # Reemplaza con el ARN del stream de tu tabla
  function_name    = aws_lambda_function.update_account.arn
  starting_position = "LATEST"
}