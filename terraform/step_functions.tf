resource "aws_sfn_state_machine" "payment_state_machine" {
  name     = "PaymentStateMachine"
  role_arn = var.devops_role_arn

  definition = <<EOF
{
  "Comment": "State machine for processing payments",
  "StartAt": "ValidateAccount",
  "States": {
    "ValidateAccount": {
      "Type": "Task",
      "Resource": "${aws_lambda_function.validate_account.arn}",
      "Parameters": {
        "pathParameters": {
          "accountId.$": "$.body.accountId"
        }
      },
      "ResultPath": "$.validationResult",
      "Next": "CheckValidationResult"
    },
    "CheckValidationResult": {
      "Type": "Choice",
      "Choices": [
        {
          "Variable": "$.validationResult.statusCode",
          "NumericEquals": 200,
          "Next": "ExecutePayment"
        }
      ],
      "Default": "ValidationFailed"
    },
    "ExecutePayment": {
      "Type": "Task",
      "Resource": "${aws_lambda_function.execute_payment.arn}",
      "Parameters": {
        "body": {
          "amount.$": "$.body.amount",
          "accountId.$": "$.body.accountId"
        }
      },
      "ResultPath": "$.paymentResult",
      "Next": "ParsePaymentResult"
    },
    "ParsePaymentResult": {
      "Type": "Pass",
      "Parameters": {
        "parsedBody.$": "States.StringToJson($.paymentResult.body)"
      },
      "ResultPath": "$.parsedPaymentResult",
      "Next": "CheckPaymentResult"
    },
    "CheckPaymentResult": {
      "Type": "Choice",
      "Choices": [
        {
          "Variable": "$.paymentResult.statusCode",
          "NumericEquals": 200,
          "Next": "RecordTransaction"
        }
      ],
      "Default": "PaymentFailed"
    },
    "RecordTransaction": {
      "Type": "Task",
      "Resource": "${aws_lambda_function.save_transaction.arn}",
      "Parameters": {
        "body": {
          "accountId.$": "$.body.accountId",
          "transactionCode.$": "$.parsedPaymentResult.parsedBody.transactionCode",
          "amount.$": "$.parsedPaymentResult.parsedBody.amount"
        }
      },
      "ResultPath": "$.transactionResult",
      "Next": "CheckRecordTransactionResult"
    },
      "CheckRecordTransactionResult": {
      "Type": "Choice",
      "Choices": [
        {
          "Variable": "$.transactionResult.statusCode",
          "NumericEquals": 201,
          "Next": "Success"
        }
      ],
      "Default": "TransactionFailed"
    },
    "ValidationFailed": {
      "Type": "Fail",
      "Error": "ValidationFailed",
      "Cause": "User validation failed."
    },
    "PaymentFailed": {
      "Type": "Fail",
      "Error": "PaymentFailed",
      "Cause": "Payment execution failed."
    },
    "TransactionFailed": {
      "Type": "Fail",
      "Error": "TransactionFailed",
      "Cause": "Transaction execution failed."
    },
    "Success": {
      "Type": "Succeed",
      "OutputPath": "$.transactionResult"
    }
  }
}
EOF
}