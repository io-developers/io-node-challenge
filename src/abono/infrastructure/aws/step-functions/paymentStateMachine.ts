export const paymentStateMachine = {
  Comment: "Payment processing state machine",
  StartAt: "ExecutePayment",
  States: {
    ExecutePayment: {
      Type: "Task",
      Resource: "${LambdaExecutePaymentArn}",
      Next: "SaveTransaction"
    },
    SaveTransaction: {
      Type: "Task",
      Resource: "${LambdaSaveTransactionArn}",
      Next: "UpdateAccount"
    },
    UpdateAccount: {
      Type: "Task",
      Resource: "${LambdaUpdateAccountArn}",
      Next: "ReturnSuccess"
    },
    ReturnSuccess: {
      Type: "Pass",
      ResultPath: "$.transactionId", // Se asegura de que el ID de la transacción esté en la respuesta
      Parameters: {
        "message.$": "States.Format('Transaction {0} processed successfully', $.transactionId)"
      },
      End: true
    }
  }
};
