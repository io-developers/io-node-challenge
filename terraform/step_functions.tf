resource "aws_sfn_state_machine" "payment_state_machine" {
  name     = "PaymentStateMachine"
  role_arn = var.devops_role_arn
  type     = "EXPRESS"  # Cambiar el tipo a EXPRESS

  definition = <<EOF
{
  "Comment": "State machine for processing payments",
  "StartAt": "CheckPaymentParameters",
  "States": {
    "CheckPaymentParameters": {
      "Type": "Choice",
      "Choices": [
        {
          "And": [
            {
              "Variable": "$.amount",
              "IsPresent": true
            },
            {
              "Variable": "$.accountId",
              "IsPresent": true
            }
          ],
          "Next": "ValidateAccount"
        }
      ],
      "Default": "InputError"
    },
    "ValidateAccount": {
      "Type": "Task",
      "Resource": "${aws_lambda_function.validate_account.arn}",
      "Parameters": {
        "pathParameters": {
          "accountId.$": "$.accountId"
        }
      },
      "ResultPath": "$.validationResult",
      "Next": "CheckValidationResult",
      "Catch": [
        {
          "ErrorEquals": ["States.ALL"],
          "Next": "InputError"
        }
      ]
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
          "amount.$": "$.amount",
          "accountId.$": "$.accountId"
        }
      },
      "ResultPath": "$.paymentResult",
      "Next": "ParsePaymentResult",
      "Catch": [
        {
          "ErrorEquals": ["States.ALL"],
          "Next": "InputError"
        }
      ]
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
          "accountId.$": "$.accountId",
          "transactionCode.$": "$.parsedPaymentResult.parsedBody.transactionCode",
          "amount.$": "$.parsedPaymentResult.parsedBody.amount"
        }
      },
      "ResultPath": "$.transactionResult",
      "Next": "ParseTransactionResult",
      "Catch": [
        {
          "ErrorEquals": ["States.ALL"],
          "Next": "InputError"
        }
      ]
    },
    "ParseTransactionResult": {
      "Type": "Pass",
      "Parameters": {
        "parsedBody.$": "States.StringToJson($.transactionResult.body)"
      },
      "ResultPath": "$.parsedTransactionResult",
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
    "InputError": {
      "Type": "Fail",
      "Error": "InputError",
      "Cause": "The input provided was malformed."
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
      "OutputPath": "$.parsedTransactionResult.parsedBody"
    }
  }
}
EOF
}